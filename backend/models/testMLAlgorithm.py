from pymongo import MongoClient
import math
from datetime import datetime, timedelta

# Database Setup // (Will probably need to update variable names)
client = MongoClient("mongodb://localhost:27017/")
db = client["recommendation_app"]
posts_col = db["posts"]
users_col = db["users"]

//Helper function, normalizes probs
def normalize_probs(probs):
    total = sum(probs.values())
    return {k: v / total for k, v in probs.items()}

//Alters user prior probability, affecting what posts they will see first
def update_user_prior(user_id, category_clicked):
    user = users_col.find_one({"user_id": user_id})
    priors = user["category_prior"]
    priors[category_clicked] += 0.05
    priors = normalize_probs(priors)
    users_col.update_one({"user_id": user_id}, {"$set": {"category_prior": priors}})

// Gives ever post a score, allowing them to be sorted based on user history
def score_post(post, priors, last_viewed_category=None):
    category_score = priors.get(post["category"], 0.0)

    rating_score = (post.get("rating", 0.0) / 5.0) * 0.3
    review_score = math.log1p(post.get("num_reviews", 0)) * 0.1

    recency_bonus = 0
    if last_viewed_category and last_viewed_category == post["category"]:
        time_decay = max(0, 1 - (datetime.utcnow() - post.get("created_at", datetime.utcnow())).days / 7)
        recency_bonus = 0.2 * time_decay

    return category_score + rating_score + review_score + recency_bonus

// Gets posts and places them in the order the user should see them
def get_ranked_posts(user_id):
    user = users_col.find_one({"user_id": user_id})
    viewed_posts = set(user.get("viewed_posts", []))
    priors = user["category_prior"]
    last_viewed_cat = user.get("last_viewed_category")

    posts = list(posts_col.find())
    ranked = []

    for post in posts:
        if post["post_id"] in viewed_posts:
            continue
        score = score_post(post, priors, last_viewed_cat)
        ranked.append((post, score))

    ranked.sort(key=lambda x: x[1], reverse=True)
    return [p for p, _ in ranked]

// viewed posts are removed from the list so that users will see new things
def mark_post_viewed(user_id, post_id, category):
    users_col.update_one(
        {"user_id": user_id},
        {
            "$addToSet": {"viewed_posts": post_id},
            "$set": {"last_viewed_category": category}
        }
    )
    update_user_prior(user_id, category)
