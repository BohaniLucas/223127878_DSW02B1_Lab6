import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NoticeCard({item}) {
  return (
    <View style={styles.card}>
      <Text style={styles.noticeId}>Notice {item.id}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    padding: 14,
    marginBottom: 10,
  },
  noticeId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
});
