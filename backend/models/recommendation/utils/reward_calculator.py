from typing import Dict, List
import numpy as np

class RewardCalculator:
    def __init__(self, base_reward: float = 1.0):
        """
        Initialize the reward calculator.
        
        Args:
            base_reward (float): Base reward value for positive interactions
        """
        self.base_reward = base_reward
        
    def calculate_reward(self, 
                        user_action: str, 
                        event_data: Dict, 
                        user_preferences: Dict,
                        context: Dict) -> float:
        """
        Calculate reward based on user action and context.
        
        Args:
            user_action (str): User's action (e.g., 'swipe_right', 'swipe_left', 'attend')
            event_data (Dict): Data about the recommended event
            user_preferences (Dict): User's preferences and history
            context (Dict): Current context (time, location, etc.)
            
        Returns:
            float: Calculated reward value
        """
        if user_action == 'swipe_left':
            return -0.5  # Negative reward for rejection
            
        if user_action == 'swipe_right':
            # Calculate similarity between event and user preferences
            similarity_score = self._calculate_similarity(event_data, user_preferences)
            return similarity_score * self.base_reward
            
        if user_action == 'attend':
            # Higher reward for actual attendance
            return 2.0 * self.base_reward
            
        return 0.0
    
    def _calculate_similarity(self, event_data: Dict, user_preferences: Dict) -> float:
        """
        Calculate similarity between event and user preferences.
        
        Args:
            event_data (Dict): Event data
            user_preferences (Dict): User preferences
            
        Returns:
            float: Similarity score between 0 and 1
        """
        # Extract relevant features for comparison
        event_features = {
            'category': event_data.get('category', ''),
            'tags': set(event_data.get('tags', [])),
            'location': event_data.get('location', {}),
            'time': event_data.get('time', '')
        }
        
        user_features = {
            'preferred_categories': set(user_preferences.get('preferred_categories', [])),
            'preferred_tags': set(user_preferences.get('preferred_tags', [])),
            'preferred_locations': set(user_preferences.get('preferred_locations', [])),
            'preferred_times': set(user_preferences.get('preferred_times', []))
        }
        
        # Calculate individual similarity scores
        category_similarity = 1.0 if event_features['category'] in user_features['preferred_categories'] else 0.0
        tag_similarity = len(event_features['tags'] & user_features['preferred_tags']) / max(len(event_features['tags']), 1)
        location_similarity = 1.0 if event_features['location'] in user_features['preferred_locations'] else 0.0
        time_similarity = 1.0 if event_features['time'] in user_features['preferred_times'] else 0.0
        
        # Weighted average of similarity scores
        weights = {
            'category': 0.3,
            'tags': 0.3,
            'location': 0.2,
            'time': 0.2
        }
        
        similarity_score = (
            weights['category'] * category_similarity +
            weights['tags'] * tag_similarity +
            weights['location'] * location_similarity +
            weights['time'] * time_similarity
        )
        
        return similarity_score 