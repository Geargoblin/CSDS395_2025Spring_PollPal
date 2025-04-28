import math
import random
from collections import Counter
from bson import ObjectId
from pymongo import MongoClient

from . import db
from .user import get_user_by_id

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def score_places_for_user(user_id: str):
    users_col = db["Users"]
    places_col = db["New_Places"]

    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")

    liked_place_ids = list(user.get("liked_places", []))  # Keep order for recency
    disliked_place_ids = list(user.get("disliked_places", []))

    liked_place_object_ids = []
    for pid in liked_place_ids:
        try:
            liked_place_object_ids.append(ObjectId(pid))
        except:
            continue

    disliked_place_object_ids = []
    for pid in disliked_place_ids:
        try:
            disliked_place_object_ids.append(ObjectId(pid))
        except:
            continue

    liked_places = list(db["New_Places"].find({"_id": {"$in": liked_place_object_ids}}))
    disliked_places = list(db["New_Places"].find({"_id": {"$in": disliked_place_object_ids}}))

    # Map place IDs to their types (now using Matched Type instead of Restaurant Type)
    place_id_to_type = {}
    for p in liked_places + disliked_places:
        pid = str(p["_id"])
        place_id_to_type[pid] = p.get("Matched Type", "Other").strip()

    liked_types_ordered = []
    for pid in liked_place_ids:
        if pid in place_id_to_type:
            liked_types_ordered.append(place_id_to_type[pid])

    disliked_types_ordered = []
    for pid in disliked_place_ids:
        if pid in place_id_to_type:
            disliked_types_ordered.append(place_id_to_type[pid])

    # Recency-weighted counters
    liked_type_weights = Counter()
    disliked_type_weights = Counter()

    for idx, rtype in enumerate(reversed(liked_types_ordered)):
        liked_type_weights[rtype] += (len(liked_types_ordered) - idx)

    for idx, rtype in enumerate(reversed(disliked_types_ordered)):
        disliked_type_weights[rtype] += (len(disliked_types_ordered) - idx)

    all_places = list(db["New_Places"].find())

    results = []

    for place in all_places:
        score = 0.0

        current_place_id = str(place["_id"])
        place_type = place.get("Matched Type", "Other").strip()
        likes = place.get("User Ratings Total") or 0
        rating = place.get("Rating") or 0

        # 1. Mild boost based on recent likes
        score += liked_type_weights.get(place_type, 0) * 1.1

        # 2. Mild penalty based on recent dislikes
        score -= disliked_type_weights.get(place_type, 0) * 3.5

        # 3. Quality scoring
        if rating > 0:
            score += rating * 1.5

        if likes > 0:
            score += math.log(likes + 1) * 1.2

        # 4. Heavy penalty if already liked/disliked specific place
        if current_place_id in liked_place_ids or current_place_id in disliked_place_ids:
            score -= 100

        # 5. Normalize
        probability = sigmoid(score / 10.0)

        # Building result with fields from All_Places schema
        results.append({
            "id": str(place["_id"]),
            "name": place.get("Name", "Unknown"),
            "address": place.get("Address", "Unknown"),
            "rating": place.get("Rating", 0),
            "user_ratings_total": place.get("User Ratings Total", 0),
            "price": place.get("Price", "Unknown"),
            "matched_type": place.get("Matched Type", "Other"),
            "google_types": place.get("Google Types", []),
            "photos": place.get("Photos", []),
            "reviews": place.get("Reviews", []),
            "score": probability
        })

    # ------------------------------
    # Top matches + Explore Layer (NO shuffle)
    # ------------------------------

    results.sort(key=lambda x: x["score"], reverse=True)

    top_results = []
    seen_types = set()

    # Pick up to 8 top matches with unique place types
    for place in results:
        if len(top_results) >= 8:
            break
        if place["matched_type"] not in seen_types:
            top_results.append(place)
            seen_types.add(place["matched_type"])

    # Pick 2 random explore places from remaining
    remaining_places = [p for p in results if p["matched_type"] not in seen_types]
    random_explores = random.sample(remaining_places, min(2, len(remaining_places)))
    
    # Final results: top results first, then explore results (ordered by score)
    final_results = top_results + sorted(random_explores, key=lambda x: x["score"], reverse=True)

    return final_results
