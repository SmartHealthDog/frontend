import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { RootStackParamList } from "../../App";

type BreedInfo = {
  id:
    | "cat_russianblue"
    | "cat_bengal"
    | "cat_scottishfold"
    | "cat_persian"
    | "cat_americanshorthair"
    | "dog_goldenretriever"
    | "dog_shibainu"
    | "dog_frenchbulldog"
    | "dog_bordercollie"
    | "dog_pug";
  type: "강아지" | "고양이";
  name: string;
  title: string;
  description: string;
  why_match: string;
  hashtags: string[];
};

type QuestionOption = {
  text: string;
  score: BreedInfo["id"][];
};

type Question = {
  id: number;
  question: string;
  options: {
    A: QuestionOption;
    B: QuestionOption;
  };
};

const BREED_RESULTS: BreedInfo[] = [
  {
    id: "cat_russianblue",
    type: "고양이",
    name: "러시안 블루",
    title: "신비로운 매력의 러시안 블루 ✨",
    description:
      "러시안 블루는 겉으로는 차분하고 고독해 보일 수 있으나, 가족에게는 다정하고 애교 많으며 헌신적인 성격을 가지고 있습니다. 낯선 사람 앞에서는 수줍음을 타지만, 신뢰하는 사람에게는 깊은 애정을 보여줍니다. 조용하고 안정적인 환경을 선호하며, 강한 자극보다는 포근함 속에서 관계를 쌓는 것을 좋아하지요.",
    why_match:
      "당신이 집에서 평온함을 즐기고, 소수의 사람과 깊은 교류를 선호한다면 러시안 블루가 바로 당신의 반려동물 타입입니다.",
    hashtags: ["#가족이좋아", "#겉차속따"],
  },
  {
    id: "cat_bengal",
    type: "고양이",
    name: "벵갈",
    title: "모험심 가득한 벵갈 고양이 👀",
    description:
      "벵갈은 야생적인 무늬만큼이나 활동적이고 호기심이 많은 고양이입니다. 에너지가 넘치고, 새로운 자극과 놀이를 즐기며 늘 모험을 찾습니다. 똑똑하고 활달해 가만히 있는 것보다 뛰어다니며 탐험하는 것을 좋아하지요.",
    why_match:
      "당신이 지루함을 싫어하고 새로운 경험과 자극을 찾아 나서는 성격이라면, 벵갈 고양이가 바로 당신과 꼭 닮았습니다.",
    hashtags: ["#에너지폭발", "#야생감성", "#호기심천국", "#모험왕"],
  },
  {
    id: "cat_scottishfold",
    type: "고양이",
    name: "스코티시 폴드",
    title: "포근한 매력의 스코티시 폴드 🫧",
    description:
      "스코티시 폴드는 둥근 얼굴과 접힌 귀만큼이나 성격도 부드럽고 온순합니다. 집안 분위기에 잘 적응하고, 조용히 사람 곁에 있어주는 것만으로도 큰 위로를 줍니다. 애교는 많지만 과하지 않고, 은은한 존재감으로 주변을 따뜻하게 합니다.",
    why_match:
      "당신이 안정감을 중요시하고, 편안한 관계 속에서 소소한 행복을 느낀다면 스코티시 폴드가 당신의 반려동물 타입입니다.",
    hashtags: ["#포근한매력", "#집순이냥", "#온순함", "#차분보이스"],
  },
  {
    id: "cat_persian",
    type: "고양이",
    name: "페르시안",
    title: "느긋한 우아함의 페르시안 고양이 🐈‍⬛",
    description:
      "페르시안은 조용하고 차분하며, 평화로운 일상을 선호합니다. 뛰어다니기보다는 느긋하게 누워 있는 시간이 많고, 편안한 교감을 통해 유대감을 쌓는 스타일입니다. 털 관리 등 손이 많이 가지만 그만큼 매력이 깊습니다.",
    why_match:
      "당신이 분주한 활동보다는 여유와 안정을 추구하고, 차분한 교류를 소중히 여긴다면 페르시안이 바로 당신의 스타일입니다.",
    hashtags: ["#고양이귀족", "#조용한생활", "#평화주의자"],
  },
  {
    id: "cat_americanshorthair",
    type: "고양이",
    name: "아메리칸 숏헤어",
    title: "균형 잡힌 성격의 아메리칸 숏헤어 ⚖️",
    description:
      "아메리칸 숏헤어는 활발하면서도 차분하고, 사교적이면서도 독립심이 있는 ‘균형형’ 고양이입니다. 너무 튀지 않으면서도 누구와도 잘 어울리고, 일상 속 작은 즐거움을 놓치지 않습니다.",
    why_match:
      "당신이 상황에 따라 유연하게 적응하고, 사람들과 무난하게 지내며 조화로운 관계를 중요시한다면 아메리칸 숏헤어가 당신의 반려동물 타입입니다.",
    hashtags: ["#균형잡힌매력", "#친화력굿", "#애교냥"],
  },
  {
    id: "dog_goldenretriever",
    type: "강아지",
    name: "골든 리트리버",
    title: "따뜻한 마음씨의 골든 리트리버 ☀️",
    description:
      "골든 리트리버는 친절하고 사교적이며 충성심이 강한 반려견입니다. 사람을 좋아하고, 새로운 친구를 사귀는 데도 거부감이 없습니다. 뛰어난 학습 능력과 활발한 성격 덕분에 어떤 환경에서도 긍정적인 에너지를 발산합니다.",
    why_match:
      "당신이 사람들과 함께하는 시간을 좋아하고, 따뜻한 분위기를 만드는 것을 즐긴다면 골든 리트리버가 바로 당신의 반려동물 타입입니다.",
    hashtags: ["#사람친구", "#훈련짱짱", "#활발댕", "#따뜻한성격"],
  },
  {
    id: "dog_shibainu",
    type: "강아지",
    name: "시바 이누",
    title: "독립적인 매력의 시바 이누 ☕️",
    description:
      "시바 이누는 깔끔하고 독립적인 성격으로, 자기주장이 뚜렷합니다. 때로는 고집스럽지만, 한 번 믿은 가족에게는 충실하고 든든한 존재가 됩니다. 자유로움을 좋아하면서도 자신만의 방식으로 애정을 표현합니다.",
    why_match:
      "당신이 타인의 기대보다 스스로의 기준을 따르고, 자기만의 스타일로 세상을 살아간다면 시바 이누가 당신의 반려동물 타입입니다.",
    hashtags: ["#고집쟁이", "#깔끔댕"],
  },
  {
    id: "dog_frenchbulldog",
    type: "강아지",
    name: "프렌치 불도그",
    title: "온순하고 사랑스러운 프렌치 불도그 🎀",
    description:
      "프렌치 불도그는 운동량이 많지 않고, 집에서 편안히 보내는 시간을 즐깁니다. 느긋하고 순한 성격으로, 사람 곁에 있는 것만으로도 만족합니다. 크지 않은 체구와 애교 많은 성격으로 실내 생활에 최적화되어 있지요.",
    why_match:
      "당신이 소박한 일상 속에서 안정감을 찾고, 편안한 교류를 중시한다면 프렌치 불도그가 바로 당신의 반려동물 타입입니다.",
    hashtags: ["#집콕댕", "#온순보스", "#귀요미매력", "#느긋한스타일"],
  },
  {
    id: "dog_bordercollie",
    type: "강아지",
    name: "보더 콜리",
    title: "지적인 에너지의 보더 콜리 ⚡️",
    description:
      "보더 콜리는 똑똑하고 민첩하며, 새로운 자극과 활동을 필요로 하는 반려견입니다. 단순한 산책보다 두뇌와 몸을 함께 쓰는 놀이와 훈련을 좋아하며, 언제나 배움을 즐깁니다.",
    why_match:
      "당신이 도전과 성장을 즐기고, 에너지와 호기심이 넘친다면 보더 콜리가 바로 당신의 반려동물 타입입니다.",
    hashtags: ["#천재견", "#에너지만렙", "#집중력짱", "#스포츠댕"],
  },
  {
    id: "dog_pug",
    type: "강아지",
    name: "퍼그",
    title: "사랑스러운 집콕러 퍼그 🛌",
    description:
      "퍼그는 사람 곁에 있는 것만으로도 행복을 느끼는 반려견입니다. 크지 않은 몸집에 애교와 친근함이 가득하고, 실내 생활에 적응력이 뛰어납니다. 약간 소극적일 수 있지만 그만큼 따뜻하고 순한 매력을 지녔습니다.",
    why_match:
      "당신이 안정적이고 소소한 일상을 중시하며, 언제나 곁에서 위로가 되어주는 관계를 원한다면 퍼그가 당신의 반려동물 타입입니다.",
    hashtags: ["#애교쟁이", "#사람바라기", "#소심귀요미"],
  },
];

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "친구 집에 놀러갔을 때 나는?",
    options: {
      A: {
        text: "친구와 같이 활동적인 게임을 만들고 논다",
        score: ["dog_goldenretriever", "dog_bordercollie", "cat_bengal"],
      },
      B: {
        text: "조용히 대화를 나누며 분위기를 즐긴다",
        score: ["cat_russianblue", "cat_persian", "dog_frenchbulldog"],
      },
    },
  },
  {
    id: 2,
    question: "하루 중 여유 시간이 많다면 나는?",
    options: {
      A: {
        text: "운동, 외출 등이 있는 활동적인 시간을 보낸다",
        score: ["dog_goldenretriever", "dog_bordercollie", "cat_bengal"],
      },
      B: {
        text: "집에서 책을 읽거나 음악을 듣고 편안히 쉰다",
        score: ["cat_scottishfold", "dog_pug", "cat_persian"],
      },
    },
  },
  {
    id: 3,
    question: "새로운 사람/동물을 만났을 때 나는?",
    options: {
      A: {
        text: "상대가 나에게 다가오기를 기다리는 편이다",
        score: ["cat_russianblue", "dog_shibainu", "cat_persian"],
      },
      B: 
      {
        text: "먼저 다가가 인사하고 친해지려고 한다",
        score: ["dog_goldenretriever", "dog_pug", "cat_americanshorthair"],
      },
    },
  },
  {
    id: 4,
    question: "내 반려동물이 있다면, 놀이는 \n 어떤 스타일을 좋아하길 바라나요?",
    options: {
      A: {
        text: "뛰어놀고 지적 자극 (퍼즐, 트릭)을 좋아한다",
        score: ["dog_bordercollie", "cat_bengal", "dog_goldenretriever"],
      },
      B: {
        text: "터치, 쓰다듬기, 낮은 강도의 놀이를 좋아한다",
        score: ["cat_scottishfold", "dog_frenchbulldog", "cat_russianblue"],
      },
    },
  },
  {
    id: 5,
    question: "나의 드림하우스는 어떤 모습인가요?",
    options: {
      A: {
        text: "아늑하고 조용한 작은 공간이 적합하다",
        score: ["dog_pug", "cat_persian", "dog_frenchbulldog"],
      },
      B: {
        text: "넓고 뛰어놀 공간이 많았으면 좋겠다",
        score: ["dog_bordercollie", "dog_goldenretriever", "cat_bengal"],
      },
    },
  },
  {
    id: 6,
    question: "나의 외출 스타일은?",
    options: {
      A: {
        text: "자주 산책하고 외출, 여행도 좋아한다",
        score: ["dog_goldenretriever", "dog_bordercollie", "cat_bengal"],
      },
      B: {
        text: "가끔 외출도 좋지만 집 안이 더 편하다",
        score: ["cat_russianblue", "dog_frenchbulldog", "cat_scottishfold"],
      },
    },
  },
  {
    id: 7,
    question: "친구들이 생각하는 나의 성격은?",
    options: {
      A: {
        text: "차분하고 내성적인 편이다",
        score: ["cat_russianblue", "dog_shibainu", "cat_persian"],
      },
      B: {
        text: "활발하고 외향적으로 보인다",
        score: ["dog_goldenretriever", "dog_pug", "cat_americanshorthair"],
      },
    },
  },
  {
    id: 8,
    question: "스트레스를 받을 때 나는?",
    options: {
      A: {
        text: "활동적으로 해소한다 (운동, 친구 만나기 등)",
        score: ["dog_bordercollie", "dog_goldenretriever", "cat_bengal"],
      },
      B: {
        text: "혼자 쉬면서 회복한다 (잠, 음악, 혼자 있는 시간)",
        score: ["cat_russianblue", "dog_shibainu", "cat_persian"],
      },
    },
  },
  {
    id: 9,
    question: "내 반려동물이 있다면, 관리 부담에\n대해서 어떻게 생각하나요?",
    options: {
      A: {
        text: "털 깎기, 운동, 놀기 등 손이 많이 가도 괜찮다",
        score: ["dog_bordercollie", "cat_persian", "cat_bengal"],
      },
      B: {
        text: "가능한 한 부담 적은 것이 좋다",
        score: ["dog_pug", "dog_frenchbulldog", "cat_americanshorthair"],
      },
    },
  },
  {
    id: 10,
    question: "날씨가 좋은 날에, 나는?",
    options: {
      A: {
        text: "창가나 베란다에서 햇볕 쬐거나\n 집 안에서 평온히 지낸다",
        score: ["dog_goldenretriever", "dog_bordercollie", "cat_bengal"],
      },
      B: {
        text: "밖에서 놀거나 산책하러 나간다",
        score: ["cat_scottishfold", "dog_frenchbulldog", "cat_russianblue"],
      },
    },
  },
  {
    id: 11,
    question: "내 반려동물이 있다면,\n내가 바라는 유대감은?",
    options: {
      A: {
        text: "침묵 속에서도\n존재감만으로도 위안이 됨을 중요시한다",
        score: ["cat_russianblue", "dog_frenchbulldog", "cat_persian"],
      },
      B: {
        text: "매일 상호작용, 놀기,\n함께 시간 보내는 것을 중요시한다",
        score: ["dog_goldenretriever", "dog_bordercollie", "cat_bengal"],
      },
    },
  },
  {
    id: 12,
    question: "반려동물의 훈련 및 규칙에 대한\n나의 생각은?",
    options: {
      A: {
        text: "규칙을 잘 지키고 훈련 가능한 것이 좋다",
        score: ["dog_bordercollie", "dog_goldenretriever", "cat_americanshorthair"],
      },
      B: {
        text: "자유로운 분위기가 더 좋다",
        score: ["dog_shibainu", "cat_persian", "dog_pug"],
      },
    },
  },
];

const QUESTION_IMAGES = [
  require("../assets/game_q1.png"),
  require("../assets/game_q2.png"),
  require("../assets/game_q3.png"),
  require("../assets/game_q4.png"),
  require("../assets/game_q5.png"),
  require("../assets/game_q6.png"),
  require("../assets/game_q7.png"),
  require("../assets/game_q8.png"),
  require("../assets/game_q9.png"),
  require("../assets/game_q10.png"),
  require("../assets/game_q11.png"),
  require("../assets/game_q12.png"),
];

const initialScores: Record<BreedInfo["id"], number> = BREED_RESULTS.reduce(
  (acc, breed) => {
    acc[breed.id] = 0;
    return acc;
  },
  {} as Record<BreedInfo["id"], number>
);

const GameScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<BreedInfo["id"], number>>(initialScores);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleStart = () => {
    setStep("quiz");
    setCurrentIndex(0);
    setScores({ ...initialScores });
  };

  const handleAnswer = (choice: "A" | "B") => {
    const updatedScores = { ...scores };

    currentQuestion.options[choice].score.forEach((breedId) => {
      updatedScores[breedId] = (updatedScores[breedId] || 0) + 1;
    });

    setScores(updatedScores);

    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setStep("result");
    }
  };

  const handleRestart = () => {
    setStep("intro");
    setCurrentIndex(0);
    setScores({ ...initialScores });
  };

  const handleGoHome = () => {
    navigation.navigate("Main" as never);
  };

  const topBreed = useMemo(() => {
    const highest = Object.entries(scores).reduce(
      (acc, [breedId, value]) => {
        if (value > acc.value) {
          return { breedId: breedId as BreedInfo["id"], value };
        }
        return acc;
      },
      { breedId: BREED_RESULTS[0].id, value: -Infinity }
    );

    return BREED_RESULTS.find((breed) => breed.id === highest.breedId);
  }, [scores]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {step === "intro" && (
          <View style={styles.introContainer}>
            <Text style={styles.mainTitle}>
              <Text style={styles.titleDog}>멍</Text>
              <Text style={styles.titleCat}>냥</Text>
              <Text> 성향테스트</Text>
            </Text>

            <Text style={styles.introCaption}>
              나와 가장 비슷한 반려동물은?{"\n"}12개의 간단한 질문으로 알아봐요
            </Text>

            <Image
              source={require("../assets/game_title.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />

            <View style={styles.startButtonWrapper}>
              <CustomButton text="시작하기" onPress={handleStart} width={170} />
            </View>
          </View>
        )}

        {step === "quiz" && (
          <View style={styles.quizContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                Q{currentIndex + 1} / {QUIZ_QUESTIONS.length}
              </Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.quizContent}>
              <Text style={styles.questionText}>{currentQuestion.question}</Text>

              <Image
                source={QUESTION_IMAGES[currentIndex]}
                style={styles.questionImage}
                resizeMode="contain"
              />

              <View style={styles.optionList}>
                {(["A", "B"] as const).map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.optionButton,
                      key === "B" && styles.optionButtonLast,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleAnswer(key)}
                  >
                    <View style={styles.optionBadge}>
                      <Text style={styles.optionBadgeText}>{key}</Text>
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        currentQuestion.options[key].text.length >= 23 &&
                          styles.optionTextSmall,
                      ]}
                    >
                      {currentQuestion.options[key].text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === "result" && topBreed && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>
              나와 가장 비슷한{" "}
              <Text style={styles.resultTypeHighlight}>
                {topBreed.type === "고양이" ? "고양이" : "강아지"}
              </Text>
            </Text>
            <Text style={styles.resultName}>{topBreed.name}</Text>
            <Text style={styles.resultTitle}>{topBreed.title}</Text>
            <Text style={styles.resultDesc}>{topBreed.description}</Text>
            <Text style={styles.resultWhy}>{topBreed.why_match}</Text>

            <View style={styles.hashtagRow}>
              {topBreed.hashtags.map((tag) => (
                <View key={tag} style={styles.hashtagChip}>
                  <Text style={styles.hashtagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.restartButtonWrapper}>
              <CustomButton text="다시 테스트하기" onPress={handleRestart} width={170} />
            </View>
            <View style={styles.homeButtonWrapper}>
              <TouchableOpacity onPress={handleGoHome} activeOpacity={0.7}>
                <Text style={styles.homeLinkText}>홈으로 가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: "center",
  },
  introContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: 20,
  },
  mainTitle: {
    fontSize: 32,
    color: "#000000",
    fontFamily: "Pretendard-SemiBold",
    fontWeight: "700",
  },
  titleDog: {
    color: "#0081D5",
  },
  titleCat: {
    color: "#FFC94D",
  },
  heroImage: {
    width: 240,
    height: 240,
    marginTop: 75,
    marginBottom: 0,
  },
  introCaption: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "Pretendard-SemiBold",
    marginTop: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  startButtonWrapper: {
    marginTop: 33,
  },
  quizContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
  },
  progressRow: {
    marginBottom: 18,
    alignSelf: "stretch",
  },
  progressText: {
    fontSize: 14,
    color: "#0081D5",
    fontWeight: "700",
    fontFamily: "Pretendard-SemiBold",
    marginBottom: 8,
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    borderRadius: 8,
    backgroundColor: "#E9F3FA",
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "#0081D5",
  },
  quizContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 32,
    fontFamily: "Pretendard-Bold",
    textAlign: "center",
    marginBottom: 90,
  },
  optionList: {
    width: "100%",
    alignItems: "center",
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "##FFF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    justifyContent: "center",
  },
  optionButtonLast: {
    marginBottom: 0,
  },
  questionImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0081D5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    textAlign: "center",
  },
  optionBadgeText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    lineHeight: 22,
    fontFamily: "Pretendard-Medium",
    fontWeight: "500",
  },
  optionTextSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
  },
  resultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  resultLabel: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "700",
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
  },
  resultTypeHighlight: {
    fontSize: 20,
    color: "#0081D5",
    fontWeight: "700",
    fontFamily: "Pretendard-SemiBold",
  },
  resultName: {
    fontSize: 32,
    color: "#0081D5",
    fontWeight: "700",
    fontFamily: "Pretendard-Bold",
    textAlign: "center",
    marginTop: 35,
  },
  resultTitle: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "600",
    fontFamily: undefined, // allow system emoji font
    marginTop: 14,
    lineHeight: 24,
    textAlign: "center",
  },
  resultDesc: {
    fontSize: 14,
    color: "#000",
    lineHeight: 30,
    fontFamily: "Pretendard-Regular",
    marginTop: 50,
    marginBottom: 10,
    textAlign: "left",
  },
  resultWhy: {
    fontSize: 14,
    color: "#000",
    lineHeight: 30,
    fontFamily: "Pretendard-Regular",
    marginBottom: 24,
    textAlign: "left",
  },
  hashtagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  hashtagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F2FBFA",
    borderRadius: 32,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#0081D5",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
    flexDirection: "row",
  },
  hashtagText: {
    fontSize: 16,
    color: "#0081D5",
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 20,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  restartButtonWrapper: {
    marginTop: 50,
    alignItems: "center",
  },
  homeButtonWrapper: {
    marginTop: 20,
    alignItems: "center",
  },
  homeLinkText: {
    fontSize: 14,
    color: '#0081D5',
    fontWeight: '600',
  },
});
