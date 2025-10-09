import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Searchbar, Card, Chip, SegmentedButtons } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { daoService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const { data: daos, isLoading } = useQuery({
    queryKey: ['daos'],
    queryFn: daoService.getAll,
  });

  const filteredDAOs = daos?.filter(dao => {
    const matchesSearch = dao.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dao.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || dao.category === category;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search DAOs..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <SegmentedButtons
        value={category}
        onValueChange={setCategory}
        buttons={[
          { value: 'all', label: 'All' },
          { value: 'Climate', label: 'Climate' },
          { value: 'Bio', label: 'Bio' },
          { value: 'Tech', label: 'Tech' },
        ]}
        style={styles.segments}
      />

      <ScrollView style={styles.results}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : filteredDAOs.length === 0 ? (
          <Text style={styles.noResults}>No DAOs found</Text>
        ) : (
          filteredDAOs.map((dao) => (
            <Card 
              key={dao.id} 
              style={styles.card}
              onPress={() => navigation.navigate('DAODetail', { id: dao.id })}
            >
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text variant="titleMedium">{dao.name}</Text>
                  <Chip compact>{dao.status}</Chip>
                </View>
                <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
                  {dao.description}
                </Text>
                <View style={styles.chipContainer}>
                  <Chip compact icon="chart-line">{dao.researchFocus}</Chip>
                  <Chip compact icon="account-group">{dao.memberCount} members</Chip>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchbar: {
    margin: 16,
  },
  segments: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  results: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
});
