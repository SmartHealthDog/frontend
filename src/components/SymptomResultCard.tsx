import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  content: string;
}

const SymptomResultCard: React.FC<Props> = ({ title, content }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

export default SymptomResultCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0081D5',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    color: '#7B7C7D',
  },
});
