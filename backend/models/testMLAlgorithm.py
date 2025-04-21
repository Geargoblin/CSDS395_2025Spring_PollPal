# filepath: /backend/models/testMLAlgorithm.py

import math
from pymongo import MongoClient
from collections import Counter

from . import db
from .user import get_user_by_id

# Sigmoid function to convert raw score to probability
def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def score_places_for_user(user_id: int):

    users_col = db["Users"]
    places_col = db["Places"]

    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")

    preferences = set(user.get("preferences", []))
    liked_place_ids = set(user.get("liked_places", []))
    disliked_place_ids = set(user.get("disliked_places", []))

    liked_places = list(places_col.find({"Place ID": {"$in": list(liked_place_ids)}}))
    disliked_places = list(places_col.find({"Place ID": {"$in": list(disliked_place_ids)}}))

    liked_cat_counts = Counter([p["Restaurant Type"] for p in liked_places if "Restaurant Type" in p])
    disliked_cat_counts = Counter([p["Restaurant Type"] for p in disliked_places if "Restaurant Type" in p])

    all_places = list(places_col.find())

    results = []

    for place in all_places:
        score = 0.0

        place_id = place["Place ID"]
        category = place.get("Restaurant Type", "")
        reviews = place.get("User Ratings Total", 0)
        rating = place.get("Rating", 0)

        # Preference boost
        if category in preferences:
            score += 10.0

        # Normalize reviews (log-scale)
        score += math.log(reviews+1) * 4

        # Like/dislike ratio boost
        score += rating * 2

        # Already liked/disliked penalty
        if place_id in liked_place_ids or place_id in disliked_place_ids:
            score -= 60

        # Category match with liked/disliked categories
        liked_cat_boost = liked_cat_counts.get(category, 0) * 3
        disliked_cat_penalty = disliked_cat_counts.get(category, 0) * 3
        score += liked_cat_boost
        score -= disliked_cat_penalty

        probability = sigmoid(score)

        results.append({
            "place_id": place_id,
            "name": place["Name"],
            "score": probability,
            "category": category
        })

    #Sorts the places and returns the first 10
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:10]
