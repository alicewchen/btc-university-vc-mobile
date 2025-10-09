import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Chip, HelperText } from 'react-native-paper';
import { contractService } from '../services/api';

export default function CreateDAOScreen() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Climate',
    researchFocus: '',
    fundingGoal: '',
    governanceToken: '',
    initialSupply: '1000000',
    proposalThreshold: '1000',
    votingDuration: '7',
    quorumPercentage: '10',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Climate', 'Biotech', 'Quantum', 'Ocean', 'Space', 'AI'];

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      const result = await contractService.createDAO(formData);
      console.log('DAO created:', result);
      // Navigate to DAO detail or show success
    } catch (error) {
      console.error('Error creating DAO:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text variant="headlineSmall" style={styles.title}>
          Create Research DAO
        </Text>

        <TextInput
          label="DAO Name*"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Description*"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Text variant="labelLarge" style={styles.label}>
          Category*
        </Text>
        <View style={styles.chipContainer}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              selected={formData.category === cat}
              onPress={() => setFormData({ ...formData, category: cat })}
              style={styles.chip}
            >
              {cat}
            </Chip>
          ))}
        </View>

        <TextInput
          label="Research Focus*"
          value={formData.researchFocus}
          onChangeText={(text) => setFormData({ ...formData, researchFocus: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Funding Goal (USD)*"
          value={formData.fundingGoal}
          onChangeText={(text) => setFormData({ ...formData, fundingGoal: text })}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Governance Token Symbol*"
          value={formData.governanceToken}
          onChangeText={(text) => setFormData({ ...formData, governanceToken: text.toUpperCase() })}
          mode="outlined"
          style={styles.input}
        />

        <Text variant="titleSmall" style={styles.sectionTitle}>
          Governance Parameters
        </Text>

        <TextInput
          label="Initial Token Supply"
          value={formData.initialSupply}
          onChangeText={(text) => setFormData({ ...formData, initialSupply: text })}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Proposal Threshold"
          value={formData.proposalThreshold}
          onChangeText={(text) => setFormData({ ...formData, proposalThreshold: text })}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Voting Duration (days)"
          value={formData.votingDuration}
          onChangeText={(text) => setFormData({ ...formData, votingDuration: text })}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Quorum Percentage"
          value={formData.quorumPercentage}
          onChangeText={(text) => setFormData({ ...formData, quorumPercentage: text })}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <HelperText type="info">
          Creating a DAO requires connecting your wallet and paying a creation fee
        </HelperText>

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={isSubmitting}
          disabled={isSubmitting || !formData.name || !formData.description}
          style={styles.button}
        >
          Create DAO
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
  form: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  },
});
