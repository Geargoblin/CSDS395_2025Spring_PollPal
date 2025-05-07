from typing import Dict, List, Any
import pandas as pd
from datetime import datetime
import numpy as np

class DataPreprocessor:
    def __init__(self):
        """Initialize the data preprocessor."""
        self.categorical_columns = ['category', 'location', 'tags']
        self.numerical_columns = ['price', 'duration', 'capacity']
        self.datetime_columns = ['start_time', 'end_time']
        
    def preprocess_event_data(self, event_data: Dict) -> Dict:
        """
        Preprocess event data for the recommendation system.
        
        Args:
            event_data (Dict): Raw event data
            
        Returns:
            Dict: Preprocessed event data
        """
        processed_data = event_data.copy()
        
        # Process categorical features
        for col in self.categorical_columns:
            if col in processed_data:
                if isinstance(processed_data[col], list):
                    processed_data[col] = self._process_categorical_list(processed_data[col])
                else:
                    processed_data[col] = self._process_categorical(processed_data[col])
        
        # Process numerical features
        for col in self.numerical_columns:
            if col in processed_data:
                processed_data[col] = self._process_numerical(processed_data[col])
        
        # Process datetime features
        for col in self.datetime_columns:
            if col in processed_data:
                processed_data[col] = self._process_datetime(processed_data[col])
        
        return processed_data
    
    def preprocess_user_data(self, user_data: Dict) -> Dict:
        """
        Preprocess user data for the recommendation system.
        
        Args:
            user_data (Dict): Raw user data
            
        Returns:
            Dict: Preprocessed user data
        """
        processed_data = user_data.copy()
        
        # Process user preferences
        if 'preferences' in processed_data:
            processed_data['preferences'] = self._process_preferences(processed_data['preferences'])
        
        # Process user history
        if 'history' in processed_data:
            processed_data['history'] = self._process_history(processed_data['history'])
        
        return processed_data
    
    def _process_categorical(self, value: Any) -> str:
        """Process a single categorical value."""
        if value is None:
            return ''
        return str(value).lower().strip()
    
    def _process_categorical_list(self, values: List[Any]) -> List[str]:
        """Process a list of categorical values."""
        if not values:
            return []
        return [self._process_categorical(v) for v in values]
    
    def _process_numerical(self, value: Any) -> float:
        """Process a numerical value."""
        if value is None:
            return 0.0
        try:
            return float(value)
        except (ValueError, TypeError):
            return 0.0
    
    def _process_datetime(self, value: Any) -> str:
        """Process a datetime value."""
        if value is None:
            return ''
        try:
            if isinstance(value, str):
                dt = datetime.fromisoformat(value)
            else:
                dt = value
            return dt.isoformat()
        except (ValueError, TypeError):
            return ''
    
    def _process_preferences(self, preferences: Dict) -> Dict:
        """Process user preferences."""
        processed = {}
        
        # Process categorical preferences
        for key in ['categories', 'tags', 'locations']:
            if key in preferences:
                processed[key] = self._process_categorical_list(preferences[key])
        
        # Process time preferences
        if 'preferred_times' in preferences:
            processed['preferred_times'] = [
                self._process_datetime(t) for t in preferences['preferred_times']
            ]
        
        return processed
    
    def _process_history(self, history: List[Dict]) -> List[Dict]:
        """Process user history."""
        processed = []
        
        for event in history:
            processed_event = {
                'event_id': event.get('event_id', ''),
                'action': event.get('action', ''),
                'timestamp': self._process_datetime(event.get('timestamp')),
                'rating': self._process_numerical(event.get('rating'))
            }
            processed.append(processed_event)
        
        return processed 