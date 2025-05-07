import numpy as np
from typing import Dict, List, Tuple
import json
import os

class QLearningRecommender:
    def __init__(self, learning_rate: float = 0.1, discount_factor: float = 0.9, exploration_rate: float = 0.1):
        """
        Initialize the Q-learning recommender system.
        
        Args:
            learning_rate (float): Rate at which the agent learns
            discount_factor (float): How much future rewards are valued
            exploration_rate (float): Probability of exploring vs exploiting
        """
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.exploration_rate = exploration_rate
        self.q_table = {}
        self.model_path = os.path.join(os.path.dirname(__file__), '../data/q_table.json')
        
    def get_state_key(self, user_id: str, context: Dict) -> str:
        """Convert user state and context to a unique key."""
        return f"{user_id}_{json.dumps(context, sort_keys=True)}"
    
    def get_action(self, state_key: str, available_events: List[str]) -> str:
        """
        Choose an action using epsilon-greedy policy.
        
        Args:
            state_key (str): Current state key
            available_events (List[str]): List of available events to recommend
            
        Returns:
            str: Selected event ID
        """
        if state_key not in self.q_table:
            self.q_table[state_key] = {event_id: 0.0 for event_id in available_events}
            
        if np.random.random() < self.exploration_rate:
            return np.random.choice(available_events)
        else:
            return max(self.q_table[state_key].items(), key=lambda x: x[1])[0]
    
    def update(self, state_key: str, action: str, reward: float, next_state_key: str, next_available_events: List[str]):
        """
        Update Q-values based on the reward received.
        
        Args:
            state_key (str): Current state key
            action (str): Action taken
            reward (float): Reward received
            next_state_key (str): Next state key
            next_available_events (List[str]): Available events in next state
        """
        if state_key not in self.q_table:
            self.q_table[state_key] = {}
            
        if next_state_key not in self.q_table:
            self.q_table[next_state_key] = {event_id: 0.0 for event_id in next_available_events}
            
        current_q = self.q_table[state_key].get(action, 0.0)
        next_max_q = max(self.q_table[next_state_key].values())
        
        # Q-learning update formula
        new_q = current_q + self.learning_rate * (reward + self.discount_factor * next_max_q - current_q)
        self.q_table[state_key][action] = new_q
    
    def save_model(self):
        """Save the Q-table to disk."""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, 'w') as f:
            json.dump(self.q_table, f)
    
    def load_model(self):
        """Load the Q-table from disk."""
        if os.path.exists(self.model_path):
            with open(self.model_path, 'r') as f:
                self.q_table = json.load(f)
    
    def get_recommendations(self, user_id: str, context: Dict, available_events: List[str], n: int = 5) -> List[str]:
        """
        Get top N recommendations for a user.
        
        Args:
            user_id (str): User ID
            context (Dict): Current context
            available_events (List[str]): Available events to recommend
            n (int): Number of recommendations to return
            
        Returns:
            List[str]: List of recommended event IDs
        """
        state_key = self.get_state_key(user_id, context)
        if state_key not in self.q_table:
            return np.random.choice(available_events, size=min(n, len(available_events)), replace=False).tolist()
            
        # Get Q-values for available events
        event_q_values = {event_id: self.q_table[state_key].get(event_id, 0.0) 
                         for event_id in available_events}
        
        # Sort events by Q-value and return top N
        sorted_events = sorted(event_q_values.items(), key=lambda x: x[1], reverse=True)
        return [event_id for event_id, _ in sorted_events[:n]] 