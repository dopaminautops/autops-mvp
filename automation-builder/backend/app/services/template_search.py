from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


class TemplateSearcher:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def best_match(self, query: str, templates: list[dict]) -> tuple[dict | None, float]:
        if not templates:
            return None, 0.0
        query_vec = self.model.encode([query])
        corpus_vec = self.model.encode([f"{t['name']} {t['description']}" for t in templates])
        scores = cosine_similarity(query_vec, corpus_vec)[0]
        best_idx = int(np.argmax(scores))
        return templates[best_idx], float(scores[best_idx])


searcher = TemplateSearcher()
