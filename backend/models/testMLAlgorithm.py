# filepath: /backend/models/testMLAlgorithm.py

import math
from pymongo import MongoClient
from collections import Counter

from . import db

# Sigmoid function to convert raw score to probability
def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def score_places_for_user(user_id: int):

    users_col = db["Users"]
    places_col = db["Places"]

    user = users_col.find_one({"user_id": user_id})
    if not user:
        raise ValueError("User not found")

    preferences = set(user.get("preferences", []))
    liked_place_ids = set(user.get("liked_places", []))
    disliked_place_ids = set(user.get("disliked_places", []))

    liked_places = list(places_col.find({"place_id": {"$in": list(liked_place_ids)}}))
    disliked_places = list(places_col.find({"place_id": {"$in": list(disliked_place_ids)}}))

    liked_cat_counts = Counter([p["category"] for p in liked_places])
    disliked_cat_counts = Counter([p["category"] for p in disliked_places])

    all_places = list(places_col.find())

    results = []

    for place in all_places:
        score = 0.0

        place_id = place["place_id"]
        category = place.get("category", "")
        likes = place.get("likes", 0)
        dislikes = place.get("dislikes", 0)

        # Preference boost
        if category in preferences:
            score += 2.0

        # Normalize likes (log-scale)
        score += math.log(likes + 1) * 5

        # Like/dislike ratio boost
        if (likes + dislikes) > 0:
            ratio = likes / (likes + dislikes)
            score += ratio * 4
        else:
            score += 4

        # Already liked/disliked penalty
        if place_id in liked_place_ids or place_id in disliked_place_ids:
            score -= 60

        # Category match with liked/disliked categories
        liked_cat_boost = liked_cat_counts.get(category, 0) / 20.0
        disliked_cat_penalty = disliked_cat_counts.get(category, 0) / 20.0
        score += liked_cat_boost
        score -= disliked_cat_penalty

        probability = sigmoid(score)

        results.append({
            "place_id": place_id,
            "name": place["name"],
            "score": probability,
            "category": category
        })

    #Sorts the places and returns the first 10
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:10]

# Example usage
if __name__ == "__main__":
    sorted_places = score_places_for_user(user_id=123)
    for p in sorted_places[:10]:
        print(f"{p['name']} ({p['category']}): {p['score']:.4f}")
