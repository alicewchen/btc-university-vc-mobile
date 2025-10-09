import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { daoService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const { data: daos, isLoading } = useQuery({
    queryKey: ['daos'],
    queryFn: daoService.getAll,
  });

  const featuredDAOs = daos?.slice(0, 3) || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text variant="headlineMedium" style={styles.heroTitle}>
          Welcome to Ethereum Nature Reserve
        </Text>
        <Text variant="bodyLarge" style={styles.heroSubtitle}>
          Explore groundbreaking research DAOs and contribute to science
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Featured DAOs
        </Text>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          featuredDAOs.map((dao) => (
            <Card key={dao.id} style={styles.card} onPress={() => navigation.navigate('DAODetail', { id: dao.id })}>
              <Card.Content>
                <Text variant="titleMedium">{dao.name}</Text>
                <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
                  {dao.description}
                </Text>
                <View style={styles.chipContainer}>
                  <Chip compact>{dao.category}</Chip>
                  <Chip compact mode="outlined">{dao.memberCount} members</Chip>
                </View>
                <View style={styles.fundingBar}>
                  <View 
                    style={[
                      styles.fundingProgress, 
                      { width: `${(dao.fundingRaised / dao.fundingGoal) * 100}%` }
                    ]} 
                  />
                </View>
                <Text variant="bodySmall" style={styles.fundingText}>
                  ${dao.fundingRaised.toLocaleString()} / ${dao.fundingGoal.toLocaleString()}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        <Button 
          mode="contained" 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Explore')}
        >
          Explore All DAOs
        </Button>
        <Button 
          mode="outlined" 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Create')}
        >
          Create Your DAO
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hero: {
    padding: 20,
    backgroundColor: '#FF6B35',
  },
  heroTitle: {
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  description: {
    marginTop: 8,
    marginBottom: 12,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  fundingBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fundingProgress: {
    height: '100%',
    backgroundColor: '#FF6B35',
  },
  fundingText: {
    color: '#666',
  },
  actionButton: {
    marginBottom: 12,
  },
});
