import requests
import json

OLLAMA_URL = "http://localhost:11434/api/chat"

def ask_ollama(model_name, query, contexts, metadatas):
    blocks = [
        f"Source: {meta.get('source', 'Unknown')}, Page {meta.get('page', '?')}, Lines {meta.get('line_start', '?')}-{meta.get('line_end', '?')}:\n{ctx}"
        for ctx, meta in zip(contexts, metadatas)
    ]
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": "Use the following context to answer the user's question."},
            {"role": "user", "content": f"Context:\n\n{chr(10).join(blocks)}\n\nQuestion: {query}"}
        ]
    }
    try:
        res = requests.post(OLLAMA_URL, json=payload, stream=True)
        chunks = []
        for line in res.iter_lines():
            if line:
                try:
                    data = json.loads(line.decode("utf-8"))
                    msg = data.get("message", {}).get("content", "")
                    chunks.append(msg)
                except json.JSONDecodeError:
                    continue
        return "".join(chunks).strip() or "⚠️ No response from model."
    except Exception as e:
        return f"❌ Failed to contact model: {str(e)}"
