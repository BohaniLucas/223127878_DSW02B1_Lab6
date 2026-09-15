import React, { useState, useEffect } from 'react';
import {StyleSheet,Text,View,FlatList,TouchableOpacity,SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoticeCard from './components/NoticeCard';

export default function App() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(function () {
    loadNotices();
  }, []);

  async function loadNotices() {
    setLoading(true);
    setError(null);

    let foundCache = false;

    try {
      const cachedNotices = await AsyncStorage.getItem('@uj/notices/cache');
      const cachedTime = await AsyncStorage.getItem('@uj/notices/lastUpdated');

      if (cachedNotices !== null) {
        const parsedNotices = JSON.parse(cachedNotices);
        setNotices(parsedNotices);
        setLastUpdated(cachedTime || '');
        setIsOffline(true);
        foundCache = true;
      }
    } catch (cacheError) {
    }

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const firstTen = data.slice(0, 10);
      const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit',minute: '2-digit',});

      setNotices(firstTen);
      setLastUpdated(currentTime);
      setIsOffline(false);
      setError(null);

      await AsyncStorage.setItem('@uj/notices/cache', JSON.stringify(firstTen));
      await AsyncStorage.setItem('@uj/notices/lastUpdated', currentTime);
    } catch (fetchError) {
      if (foundCache) {
        setIsOffline(true);
        setError(null);
      } else {
        setError('Unable to load notices. Check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function clearSavedNotices() {
    try {
      await AsyncStorage.removeItem('@uj/notices/cache');
      await AsyncStorage.removeItem('@uj/notices/lastUpdated');
      setNotices([]);
      setLastUpdated('');
      setIsOffline(false);
      setError('Saved notices cleared. Tap refresh to load live notices.');
    } catch (clearError) {
    }
  }

  return (
    <SafeAreaView style={styles.container}>
    
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UJ Campus Notices</Text>
        <Text style={styles.headerSubtitle}>University of Johannesburg Noticeboard</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={loadNotices}>
          <Text style={styles.refreshButtonText}>Refresh Notices</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearSavedNotices}>
          <Text style={styles.clearButtonText}>Clear Saved Notices</Text>
        </TouchableOpacity>
      </View>

      {lastUpdated !== '' && (
        <View style={styles.timerContainer}>
          <Text>
            {isOffline? `Saved Copy • Last updated ${lastUpdated}` : `Live Feed • Last updated ${lastUpdated}`}
          </Text>
        </View>
      )}

      {loading && notices.length === 0 && (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading notices...</Text>
        </View>
      )}

      {!loading && error !== null && notices.length === 0 && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={()=> loadNotices()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {notices.length > 0 && (
        <FlatList
          data={notices}
          keyExtractor={(item)=> String(item.id)}
          renderItem={({item})=> {
            return (
               <NoticeCard  item={item} />
            )
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  refreshButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  clearButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  timerText: {
    fontSize: 13,
    color: '#495057',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#555555',
  },
  errorText: {
    fontSize: 15,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
});
