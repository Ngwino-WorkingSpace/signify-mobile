import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { apiService, Survey, Question, Answer } from '../services/api';
import { authService } from '../services/auth';




interface QuestionWithOptions {
  id: string;
  text: string;
  type: "yesno" | "number" | "single_choice" | "text";
  options?: { option_id: string; option_text: string }[];
  isRequired?: boolean;
}

interface SurveyProps {
  onComplete: () => void;
}

const defaultQuestions: QuestionWithOptions[] = [
  {
    id: "1",
    text: "Have you or anyone in your household experienced fever in the last 7 days?",
    type: "yesno" as const,
  },
  {
    id: "2",
    text: "Have you or anyone in your household had difficulty breathing?",
    type: "yesno" as const,
  },
  {
    id: "3",
    text: "How many people live in your household?",
    type: "number" as const,
  },
  {
    id: "4",
    text: "Do you have access to clean drinking water daily?",
    type: "yesno" as const,
  },
  {
    id: "5",
    text: "Have you noticed any unusual health symptoms in your community?",
    type: "yesno" as const,
  },
];

export function SurveyComponent({ onComplete }: SurveyProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [numberInput, setNumberInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>(defaultQuestions);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSurveyData();
  }, []);

  const mapQuestionType = (type: string): "yesno" | "number" | "single_choice" | "text" => {
    switch (type) {
      case 'single-choice':
        return 'single_choice';
      case 'text':
        return 'text';
      case 'number':
        return 'number';
      default:
        return 'text';
    }
  };

  const loadSurveyData = async () => {
    setIsLoading(true);
    try {
      // Get user's location from auth
      const user = await authService.getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const surveys = await apiService.getSurveys(user.country, user.district, user.sector);
      // Filter to only show active surveys
      const activeSurveys = surveys.filter(survey => survey.status === 'active');
      
      if (activeSurveys.length > 0) {
        const activeSurvey = activeSurveys[0];
        setSurvey(activeSurvey);
        
        console.log(activeSurvey);
        const formattedQuestions = activeSurvey.questions.map((q, index) => ({
          id: q.question_id, // Use actual question_id from API
          text: q.question_text,
          type: mapQuestionType(q.question_type),
          options: q.options || [],
          isRequired: q.is_required,
        }));
        
        setQuestions(formattedQuestions);
      } else {
        // No active surveys found
        console.log('No active surveys found');
        setSurvey(null);
        setQuestions([]);
      }
    } catch (error) {
      console.error('Failed to load survey data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;


  const handleAnswer = async (answer: string | number) => {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setNumberInput("");
    } else {
      // Pass the new answers directly to avoid state timing issues
      await submitSurvey(newAnswers);
    }
  };

  const submitSurvey = async (answersToSubmit?: Record<string, string | number>) => {
    setIsLoading(true);
    try {
      // Get user's location from auth
      const user = await authService.getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const finalAnswers = answersToSubmit || answers;
      const surveyResponse = {
        survey_id: survey?.survey_id || 'default-survey',
        country: user.country,
        district: user.district,
        sector: user.sector,
        answers: Object.entries(finalAnswers).map(([questionId, answer]) => ({
          question_id: questionId,
          answer_text: answer.toString(),
        })),
      };
      
      await apiService.submitResponse(surveyResponse);
      setTimeout(() => {
        onComplete();
      }, 300);
    } catch (error) {
      console.error('Failed to submit survey:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (isLoading && !survey) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#18392b" />
          <Text style={styles.loadingText}>Loading survey...</Text>
        </View>
      </View>
    );
  }

  if (!survey && !isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>No Active Surveys</Text>
          <Text style={styles.emptyMessage}>
            There are currently no active surveys available in your area. Please check back later.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadSurveyData}
          >
            <Feather name="refresh-cw" size={20} color="#ffffff" />
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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

        {question.type === "single_choice" && (
          <View style={styles.answerContainer}>
            {question.options?.map((option: { option_id: string; option_text: string }) => (
              <TouchableOpacity
                key={option.option_id}
                onPress={() => handleAnswer(option.option_text)}
                style={[styles.answerButton, { marginBottom: 12 }]}
                activeOpacity={0.8}
              >
                <Text style={styles.answerButtonText}>{option.option_text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {question.type === "text" && (
          <View style={styles.answerContainer}>
            <TextInput
              value={numberInput}
              onChangeText={setNumberInput}
              placeholder="Enter your answer"
              style={[styles.numberInput, { marginBottom: 16 }]}
              placeholderTextColor="#9ca3af"
              multiline
            />
            <TouchableOpacity
              onPress={() => {
                if (numberInput.trim()) {
                  handleAnswer(numberInput.trim());
                }
              }}
              disabled={!numberInput.trim()}
              style={[
                styles.continueButton,
                !numberInput.trim() && styles.continueButtonDisabled
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18392b',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
