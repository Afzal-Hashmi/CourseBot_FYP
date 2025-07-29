# # # video_processor.py

# # import os
# # import json
# # import whisper
# # import subprocess
# # from sentence_transformers import SentenceTransformer
# # from langchain.text_splitter import CharacterTextSplitter
# # from chromadb import PersistentClient
# # import re

# # BASE_DIR = "./video_cache"
# # CHROMA_PATH = os.path.join(BASE_DIR, "chromadb")
# # CHUNKS_DIR = os.path.join(BASE_DIR, "chunks")

# # os.makedirs(BASE_DIR, exist_ok=True)
# # os.makedirs(CHROMA_PATH, exist_ok=True)
# # os.makedirs(CHUNKS_DIR, exist_ok=True)

# # client = PersistentClient(path=CHROMA_PATH)

# # def sanitize_name(name):
# #     name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)
# #     return name.strip("._-")[:100] or "video"

# # def extract_audio(video_path, audio_path):
# #     if os.path.exists(audio_path):
# #         return audio_path
# #     subprocess.run(
# #         ["ffmpeg", "-i", video_path, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", audio_path],
# #         check=True
# #     )
# #     return audio_path

# # def transcribe_audio(audio_path, transcript_path):
# #     if os.path.exists(transcript_path):
# #         with open(transcript_path) as f:
# #             return f.read()
# #     model = whisper.load_model("base")
# #     result = model.transcribe(audio_path)
# #     with open(transcript_path, "w") as f:
# #         f.write(result["text"])
# #     return result["text"]

# # def chunk_text(text, source):
# #     chunk_file = os.path.join(CHUNKS_DIR, f"{source}_chunks.json")
# #     if os.path.exists(chunk_file):
# #         with open(chunk_file) as f:
# #             return json.load(f)

# #     splitter = CharacterTextSplitter(separator="\n", chunk_size=1000, chunk_overlap=100)
# #     chunks = [{
# #         "id": f"{source}_chunk_{i}",
# #         "text": chunk,
# #         "page": 1,
# #         "line_start": 1,
# #         "line_end": 1,
# #         "source": source
# #     } for i, chunk in enumerate(splitter.split_text(text))]

# #     with open(chunk_file, "w") as f:
# #         json.dump(chunks, f)
# #     return chunks

# # def embed_chunks(chunks, source):
# #     model = SentenceTransformer("all-MiniLM-L6-v2")
# #     safe_source = sanitize_name(source)
# #     collection = client.get_or_create_collection(name=f"video_chunks_{safe_source}")
# #     if len(collection.get()["ids"]):
# #         return collection
# #     texts = [c["text"] for c in chunks]
# #     embeddings = model.encode(texts)
# #     collection.add(
# #         ids=[c["id"] for c in chunks],
# #         documents=texts,
# #         embeddings=embeddings.tolist(),
# #         metadatas=[{
# #             "page": c["page"],
# #             "line_start": c["line_start"],
# #             "line_end": c["line_end"],
# #             "source": c["source"]
# #         } for c in chunks]
# #     )
# #     return collection

# # def process_video_file(video_file_path):
# #     name = sanitize_name(os.path.splitext(os.path.basename(video_file_path))[0])
# #     audio_path = os.path.join(BASE_DIR, f"{name}.wav")
# #     transcript_path = os.path.join(BASE_DIR, f"{name}.txt")

# #     extract_audio(video_file_path, audio_path)
# #     transcript = transcribe_audio(audio_path, transcript_path)
# #     chunks = chunk_text(transcript, name)
# #     embed_chunks(chunks, name)
# #     return name


# # Updated video processor with Pinecone integration

# import os
# import json
# import whisper
# import subprocess
# from sentence_transformers import SentenceTransformer
# from langchain.text_splitter import CharacterTextSplitter
# from pinecone import Pinecone, ServerlessSpec
# import re
# import requests
# import shutil
# from fastapi import HTTPException, UploadFile, File, Depends, status
# from typing import List, Dict


# # Initialize Pinecone (add your API key here)
# PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "your-pinecone-api-key")
# PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
# PINECONE_INDEX_NAME = "courseboy"

# # Initialize Pinecone
# pc = Pinecone(api_key=PINECONE_API_KEY)

# # Create index if it doesn't exist
# if PINECONE_INDEX_NAME not in pc.list_indexes().names():
#     pc.create_index(
#         name=PINECONE_INDEX_NAME,
#         dimension=384,  # all-MiniLM-L6-v2 produces 384 dimensions
#         metric="cosine",
#         spec=ServerlessSpec(
#             cloud="aws",
#             region="us-east-1"
#         )
#     )

# index = pc.Index(PINECONE_INDEX_NAME)

# # Initialize sentence transformer
# model = SentenceTransformer("all-MiniLM-L6-v2")

# # BASE_DIR = "./video_cache"
# BASE_DIR = "./content_store"
# os.makedirs(BASE_DIR, exist_ok=True)

# OLLAMA_URL = "http://localhost:11434/api/chat"

# def sanitize_name(name):
#     name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)
#     return name.strip("._-")[:100] or "video"

# def extract_audio(video_path, audio_path):
#     if os.path.exists(audio_path):
#         return audio_path
#     subprocess.run(
#         ["ffmpeg", "-i", video_path, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", audio_path],
#         check=True
#     )
#     return audio_path

# def transcribe_audio(audio_path):
#     model = whisper.load_model("base")
#     result = model.transcribe(audio_path)
#     return result["text"]

# def chunk_text(text, source):
#     splitter = CharacterTextSplitter(separator="\n", chunk_size=1000, chunk_overlap=100)
#     chunks = [{
#         "id": f"{source}_chunk_{i}",
#         "text": chunk,
#         "metadata": {
#             "page": 1,
#             "line_start": 1,
#             "line_end": 1,
#             "source": source,
#             "chunk_index": i
#         }
#     } for i, chunk in enumerate(splitter.split_text(text))]
#     return chunks

# def embed_and_store_chunks(chunks, source):
#     # Check if vectors already exist for this source
#     existing_ids = index.fetch(ids=[f"{source}_chunk_0"])
#     if existing_ids.vectors:
#         print(f"Vectors already exist for {source}, skipping embedding")
#         return

#     # Prepare vectors for upsert
#     vectors = []
#     for chunk in chunks:
#         embedding = model.encode(chunk["text"]).tolist()
#         vectors.append({
#             "id": chunk["id"],
#             "values": embedding,
#             "metadata": {
#                 **chunk["metadata"],
#                 "text": chunk["text"]  # Store text in metadata for retrieval
#             }
#         })

#     # Upsert to Pinecone in batches
#     batch_size = 100
#     for i in range(0, len(vectors), batch_size):
#         batch = vectors[i:i + batch_size]
#         index.upsert(vectors=batch)

#     print(f"Successfully embedded and stored {len(vectors)} chunks for {source}")

# def process_video_file(video_file_path):
#     name = sanitize_name(os.path.splitext(os.path.basename(video_file_path))[0])
#     audio_path = os.path.join(BASE_DIR, f"{name}.wav")

#     # Extract audio and transcribe
#     extract_audio(video_file_path, audio_path)
#     transcript = transcribe_audio(audio_path)

#     # Save transcript for reference
#     transcript_path = os.path.join(BASE_DIR, f"{name}.txt")
#     with open(transcript_path, "w") as f:
#         f.write(transcript)

#     # Chunk text and embed
#     chunks = chunk_text(transcript, name)
#     embed_and_store_chunks(chunks, name)

#     # Clean up audio file to save space
#     if os.path.exists(audio_path):
#         os.remove(audio_path)

#     return name

# def ask_ollama(model_name, query, contexts, metadatas):
#     blocks = [
#         f"Source: {meta.get('source', 'Unknown')}, Chunk {meta.get('chunk_index', '?')}:\n{ctx}"
#         for ctx, meta in zip(contexts, metadatas)
#     ]
#     payload = {
#         "model": model_name,
#         "messages": [
#             {"role": "system", "content": "Use the following context to answer the user's question."},
#             {"role": "user", "content": f"Context:\n\n{chr(10).join(blocks)}\n\nQuestion: {query}"}
#         ]
#     }
#     try:
#         res = requests.post(OLLAMA_URL, json=payload, stream=True)
#         chunks = []
#         for line in res.iter_lines():
#             if line:
#                 try:
#                     data = json.loads(line.decode("utf-8"))
#                     msg = data.get("message", {}).get("content", "")
#                     chunks.append(msg)
#                 except json.JSONDecodeError:
#                     continue
#         return "".join(chunks).strip() or "⚠️ No response from model."
#     except Exception as e:
#         return f"❌ Failed to contact model: {str(e)}"


import http.client
import json

conn = http.client.HTTPSConnection("api.vectara.io")
payload = json.dumps(
    {
        "query": "What are the carbon reduction efforts by EU banks in 2023?",
        "search": {"limit": 50},
        "generation": {
            "generation_preset_name": "vectara-summary-ext-v1.2.0",
            "max_used_search_results": 5,
            "prompt_template": '[\n  {"role": "system", "content": "You are a helpful search assistant."},\n  #foreach ($qResult in $vectaraQueryResults)\n     {"role": "user", "content": "Given the $vectaraIdxWord[$foreach.index] search result."},\n     {"role": "assistant", "content": "${qResult.getText()}" },\n  #end\n  {"role": "user", "content": "Generate a summary for the query \'${vectaraQuery}\' based on the above results."}\n]\n',
            "max_response_characters": 300,
            "response_language": "auto",
            "model_parameters": {
                "llm_name": "gpt4",
                "max_tokens": 0,
                "temperature": 0,
                "frequency_penalty": 0,
                "presence_penalty": 0,
            },
            "citations": {
                "style": "none",
                "url_pattern": "https://vectara.com/documents/{doc.id}",
                "text_pattern": "{doc.title}",
            },
            "enable_factual_consistency_score": True,
        },
        "chat": {"store": True},
        "save_history": True,
        "intelligent_query_rewriting": False,
        "stream_response": False,
    }
)
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-api-key": "<x-api-key>",
}
conn.request("POST", "/v2/chats", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))


{
    "query": "generate 5 MCQs on encapsulation?",
    "search": {
        "corpora": [
            {
                # "corpus_key": "Tester",
                "corpus_key": "umt",
                "metadata_filter": "",
                "lexical_interpolation": 0.025,
            }
        ],
        "limit": 50,
        "context_configuration": {
            "sentences_before": 2,
            "sentences_after": 2,
            "start_tag": "%START_SNIPPET%",
            "end_tag": "%END_SNIPPET%",
        },
    },
    "generation": {
        "generation_preset_name": "vectara-summary-ext-24-05-sml",
        "max_used_search_results": 5,
        "prompt_template": '[{"role": "system", "content": "You are a helpful educational assistant."}, #foreach ($qResult in $vectaraQueryResults) {"role": "user", "content": "${qResult.getText()}"}, #end {"role": "user", "content": "Based on the above content, answer: \'${vectaraQuery}\'"}]',
        "max_response_characters": 500,
        "response_language": "auto",
        "model_parameters": {
            "max_tokens": 512,
            "temperature": 0.1,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0,
        },
        "citations": {
            "style": "numeric",
            "url_pattern": "",
            "text_pattern": "[{index}]",
        },
        "enable_factual_consistency_score": true,
    },
    "chat": {"store": true},
    "save_history": true,
    "stream_response": false,
}
