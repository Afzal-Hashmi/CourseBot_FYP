# # shared_helpers.py
# import os
# import re
# import subprocess
# import shutil
# from PyPDF2 import PdfReader
# from langchain.text_splitter import CharacterTextSplitter
# from sentence_transformers import SentenceTransformer
# from pinecone import Pinecone, ServerlessSpec
# from fastapi import HTTPException, status
# from typing import List, Dict

# BASE_DIR = "./content_store"
# os.makedirs(BASE_DIR, exist_ok=True)

# # Pinecone init
# PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
# PINECONE_ENV = os.getenv("PINECONE_ENVIRONMENT")
# INDEX_NAME = "courseboy"

# pc = Pinecone(api_key=PINECONE_API_KEY, environment=PINECONE_ENV)
# if INDEX_NAME not in pc.list_indexes().names():
#     pc.create_index(
#         name=INDEX_NAME,
#         dimension=384,
#         metric="cosine",
#         spec=ServerlessSpec(cloud="aws", region="us-east-1")
#     )
# index = pc.Index(INDEX_NAME)

# # Embedding model
# embedder = SentenceTransformer("all-MiniLM-L6-v2")

# # Sanitizer
# def sanitize_name(name: str) -> str:
#     name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)
#     return name.strip("._-")[:100] or "content"

# # **Video helpers**
# # def extract_audio(video_path, audio_path):

# #     if os.path.exists(audio_path):
# #         return audio_path
# #     subprocess.run([...], check=True)
# #     return audio_path

# def extract_audio(video_path, audio_path):
#     if os.path.exists(audio_path):
#         return audio_path
#     subprocess.run(
#         ["ffmpeg", "-i", video_path, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", audio_path],
#         check=True
#     )
#     return audio_path


# def transcribe_audio(audio_path):
#     import whisper
#     wmodel = whisper.load_model("base")
    
#     return wmodel.transcribe(audio_path)["text"]

# def chunk_text_video(text: str, source: str) -> List[Dict]:
#     splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
#     return [{
#         "id": f"{source}_vchunk_{i}",
#         "text": chunk,
#         "metadata": {"source": source, "chunk_index": i}
#     } for i, chunk in enumerate(splitter.split_text(text))]

# # **PDF helpers**
# def read_pdf(path):
#     reader = PdfReader(path)
#     pages = [(i+1, p.extract_text() or "") for i, p in enumerate(reader.pages)]
#     return pages

# def chunk_text_pdf(pages, source):
#     splits = []
#     splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
#     for page, text in pages:
#         for i, chunk in enumerate(splitter.split_text(text)):
#             splits.append({
#                 "id": f"{source}_p{page}_c{i}",
#                 "text": chunk,
#                 "metadata": {"source": source, "page": page, "chunk_index": i}
#             })
#     return splits

# # Universal embed/store
# def embed_and_store_chunks(chunks: List[Dict]):
#     print(chunks[:5])  # Show first 5 for debugging
#     if index.fetch(ids=[chunks[0]["id"]]).vectors:
#         print("Already embedded, skipping.")
#         return
#     vectors = []
#     for c in chunks:
#         vec = embedder.encode(c["text"]).tolist()
#         vectors.append({"id": c["id"], "values": vec, "metadata": c["metadata"]})
#     print(f"Embedding {len(vectors)} chunks...")
#     print(vectors[:2])  # Show first 5 for debugging
#     for i in range(0, len(vectors), 100):
#         index.upsert(vectors=vectors[i:i+100])
#     print(f"Inserted {len(vectors)} chunks.")
