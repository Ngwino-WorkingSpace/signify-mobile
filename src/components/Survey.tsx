import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SurveyProps {
  onComplete: () => void;
}

const questions = [
  {
    id: 1,
    text: "Have you or anyone in your household experienced fever in the last 7 days?",
    type: "yesno" as const,
  },
  {
    id: 2,
    text: "Have you or anyone in your household had difficulty breathing?",
    type: "yesno" as const,
  },
  {
    id: 3,
    text: "How many people live in your household?",
    type: "number" as const,
  },
  {
    id: 4,
    text: "Do you have access to clean drinking water daily?",
    type: "yesno" as const,
  },
  {
    id: 5,
    text: "Have you noticed any unusual health symptoms in your community?",
    type: "yesno" as const,
  },
];

export function Survey({ onComplete }: SurveyProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [numberInput, setNumberInput] = useState("");

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer: string | number) => {
    setAnswers({ ...answers, [question.id]: answer });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setNumberInput("");
    } else {

      setTimeout(() => {
        onComplete();
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          disabled={currentQuestion === 0}
          style={[styles.backButton, currentQuestion === 0 && styles.backButtonDisabled]}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#18392b" />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {question.text}
        </Text>

        {question.type === "yesno" && (
          <View style={styles.answerContainer}>
            <TouchableOpacity
              onPress={() => handleAnswer("yes")}
              style={[styles.answerButton, { marginBottom: 16 }]}
              activeOpacity={0.8}
            >
              <Feather name="check" size={24} color="#ffffff" />
              <Text style={[styles.answerButtonText, { marginLeft: 12 }]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAnswer("no")}
              style={styles.answerButtonSecondary}
              activeOpacity={0.8}
            >
              <Text style={styles.answerButtonSecondaryText}>No</Text>
            </TouchableOpacity>
          </View>
        )}

        {question.type === "number" && (
          <View style={styles.answerContainer}>
            <TextInput
              value={numberInput}
              onChangeText={setNumberInput}
              placeholder="Enter number"
              keyboardType="numeric"
              style={[styles.numberInput, { marginBottom: 16 }]}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity
              onPress={() => {
                if (numberInput && parseInt(numberInput) > 0) {
                  handleAnswer(parseInt(numberInput));
                }
              }}
              disabled={!numberInput || parseInt(numberInput) <= 0}
              style={[
                styles.continueButton,
                (!numberInput || parseInt(numberInput) <= 0) && styles.continueButtonDisabled
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.helperText}>
        Your responses are private and help protect your community
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    minHeight: 600,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  backButtonDisabled: {
    opacity: 0.4,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#18392b',
    borderRadius: 4,
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 24,
    color: '#1f2937',
    marginBottom: 32,
    lineHeight: 32,
  },
  answerContainer: {
  },
  answerButton: {
    width: '100%',
    backgroundColor: '#18392b',
    paddingVertical: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  answerButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  answerButtonSecondary: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButtonSecondaryText: {
    color: '#1f2937',
    fontSize: 20,
    fontWeight: '600',
  },
  numberInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontSize: 24,
    textAlign: 'center',
    color: '#1f2937',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#18392b',
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  helperText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
    marginTop: 32,
  },
});
