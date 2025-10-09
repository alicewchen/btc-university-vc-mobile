import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Chip, Button, SegmentedButtons, List, ProgressBar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { daoService, publicationService, courseService, milestoneService, governanceService } from '../services/api';

export default function DAODetailScreen({ route }: any) {
  const { id } = route.params;
  const [activeTab, setActiveTab] = useState('overview');

  const { data: dao } = useQuery({
    queryKey: ['dao', id],
    queryFn: () => daoService.getById(id),
  });

  const { data: publications } = useQuery({
    queryKey: ['publications', id],
    queryFn: () => publicationService.getByDaoId(id),
    enabled: activeTab === 'publications',
  });

  const { data: courses } = useQuery({
    queryKey: ['courses', id],
    queryFn: () => courseService.getByDaoId(id),
    enabled: activeTab === 'courses',
  });

  const { data: milestones } = useQuery({
    queryKey: ['milestones', id],
    queryFn: () => milestoneService.getByDaoId(id),
    enabled: activeTab === 'milestones',
  });

  const { data: proposals } = useQuery({
    queryKey: ['proposals', id],
    queryFn: () => governanceService.getProposals(id),
    enabled: activeTab === 'governance',
  });

  if (!dao) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium">{dao.name}</Text>
        <View style={styles.chipContainer}>
          <Chip icon="tag">{dao.category}</Chip>
          <Chip icon="chart-line">{dao.researchFocus}</Chip>
        </View>
      </View>

      {/* Tabs */}
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'overview', label: 'Overview' },
          { value: 'governance', label: 'Governance' },
          { value: 'milestones', label: 'Milestones' },
          { value: 'publications', label: 'Pubs' },
          { value: 'courses', label: 'Courses' },
        ]}
        style={styles.tabs}
      />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <View style={styles.content}>
          <Text variant="bodyLarge" style={styles.description}>
            {dao.description}
          </Text>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Funding Progress</Text>
              <ProgressBar 
                progress={dao.fundingRaised / dao.fundingGoal} 
                style={styles.progress}
              />
              <Text variant="bodyMedium" style={styles.fundingText}>
                ${dao.fundingRaised.toLocaleString()} / ${dao.fundingGoal.toLocaleString()}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Quick Stats</Text>
              <List.Item
                title="Members"
                description={`${dao.memberCount} active members`}
                left={(props) => <List.Icon {...props} icon="account-group" />}
              />
              <List.Item
                title="Status"
                description={dao.status}
                left={(props) => <List.Icon {...props} icon="information" />}
              />
              <List.Item
                title="Token"
                description={dao.governanceToken}
                left={(props) => <List.Icon {...props} icon="coins" />}
              />
            </Card.Content>
          </Card>

          <Button mode="contained" style={styles.joinButton}>
            Join DAO
          </Button>
        </View>
      )}

      {activeTab === 'governance' && (
        <View style={styles.content}>
          <Text variant="titleMedium" style={styles.tabTitle}>
            Active Proposals
          </Text>
          {proposals?.map((proposal) => (
            <Card key={proposal.id} style={styles.card}>
              <Card.Content>
                <Text variant="titleSmall">{proposal.title}</Text>
                <Text variant="bodySmall" numberOfLines={2} style={styles.proposalDesc}>
                  {proposal.description}
                </Text>
                <View style={styles.voteStats}>
                  <Chip compact icon="thumb-up">{proposal.votesFor}</Chip>
                  <Chip compact icon="thumb-down">{proposal.votesAgainst}</Chip>
                  <Chip compact>{proposal.status}</Chip>
                </View>
              </Card.Content>
            </Card>
          )) || <Text>No active proposals</Text>}
        </View>
      )}

      {activeTab === 'milestones' && (
        <View style={styles.content}>
          <Text variant="titleMedium" style={styles.tabTitle}>
            Research Milestones
          </Text>
          {milestones?.map((milestone) => (
            <Card key={milestone.id} style={styles.card}>
              <Card.Content>
                <Text variant="titleSmall">{milestone.title}</Text>
                <Text variant="bodySmall" style={styles.milestoneDesc}>
                  {milestone.description}
                </Text>
                <ProgressBar progress={milestone.progress / 100} style={styles.progress} />
                <View style={styles.milestoneFooter}>
                  <Chip compact>{milestone.status}</Chip>
                  <Text variant="bodySmall">Due: {milestone.targetDate}</Text>
                </View>
              </Card.Content>
            </Card>
          )) || <Text>No milestones</Text>}
        </View>
      )}

      {activeTab === 'publications' && (
        <View style={styles.content}>
          <Text variant="titleMedium" style={styles.tabTitle}>
            Research Publications
          </Text>
          {publications?.map((pub) => (
            <Card key={pub.id} style={styles.card}>
              <Card.Content>
                <Text variant="titleSmall">{pub.title}</Text>
                <Text variant="bodySmall" style={styles.authors}>
                  {pub.authors.join(', ')}
                </Text>
                <Text variant="bodySmall" numberOfLines={3} style={styles.abstract}>
                  {pub.abstract}
                </Text>
                <Text variant="labelSmall">{pub.publicationDate}</Text>
              </Card.Content>
            </Card>
          )) || <Text>No publications</Text>}
        </View>
      )}

      {activeTab === 'courses' && (
        <View style={styles.content}>
          <Text variant="titleMedium" style={styles.tabTitle}>
            Educational Courses
          </Text>
          {courses?.map((course) => (
            <Card key={course.id} style={styles.card}>
              <Card.Content>
                <Text variant="titleSmall">{course.title}</Text>
                <Text variant="bodySmall" numberOfLines={2} style={styles.courseDesc}>
                  {course.description}
                </Text>
                <View style={styles.courseInfo}>
                  <Chip compact icon="account">{course.instructor}</Chip>
                  <Chip compact icon="clock">{course.duration}</Chip>
                  <Chip compact>{course.difficulty}</Chip>
                </View>
                <Text variant="bodySmall">{course.enrollmentCount} enrolled</Text>
              </Card.Content>
            </Card>
          )) || <Text>No courses available</Text>}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#FF6B35',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  tabs: {
    margin: 16,
  },
  content: {
    padding: 16,
  },
  description: {
    marginBottom: 24,
    lineHeight: 24,
  },
  card: {
    marginBottom: 16,
  },
  progress: {
    marginVertical: 12,
  },
  fundingText: {
    color: '#666',
  },
  joinButton: {
    marginVertical: 16,
  },
  tabTitle: {
    marginBottom: 16,
  },
  proposalDesc: {
    marginVertical: 8,
    color: '#666',
  },
  voteStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  milestoneDesc: {
    marginVertical: 8,
    color: '#666',
  },
  milestoneFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  authors: {
    marginTop: 4,
    fontStyle: 'italic',
    color: '#666',
  },
  abstract: {
    marginVertical: 8,
    color: '#666',
  },
  courseDesc: {
    marginVertical: 8,
    color: '#666',
  },
  courseInfo: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
});
