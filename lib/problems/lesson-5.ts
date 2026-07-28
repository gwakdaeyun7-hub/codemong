// 5강 「조건문」 실력향상 문제 6개.
// 지문·스토리·테스트 데이터 전부 자체 제작 (외부 저지는 유형만 참고).
// 2026-07-16 승인 라운드 A-1 확정본 — 수정 시 solutionCode 가 전 테스트를 통과하는지 재검증할 것.

import type { ProblemSet } from "./types";

export const lesson5Problems: ProblemSet = {
  "courseId": "be-python",
  "lessonId": "lesson-5",
  "lessonNumber": 5,
  "title": "조건문",
  "problems": [
    {
      "id": "prob-1",
      "number": 1,
      "title": "두 수 비교",
      "difficulty": "easy",
      "prompt": "두 수의 크기를 견주어, 둘 사이에 들어갈 부등호를 골라 주세요.\n\n[입력]\n첫째 줄: 정수 A\n둘째 줄: 정수 B\n\n[출력] A 와 B 의 관계에 따라 다음 중 하나만 출력합니다.\nA 가 더 크면  >\nA 가 더 작으면  <\n두 수가 같으면  ==\n기호만 출력하세요.",
      "conceptTags": [
        "5강 if/elif/else",
        "4강 비교 연산자"
      ],
      "examples": [
        {
          "stdin": [
            "3",
            "5"
          ],
          "stdout": "<"
        },
        {
          "stdin": [
            "9",
            "2"
          ],
          "stdout": ">"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "a = int(input())\nb = int(input())\nif a > b:\n    print(\">\")\nelif a < b:\n    print(\"<\")\nelse:\n    print(\"==\")\n",
      "publicTests": [
        {
          "label": "예시 1 (3 < 5)",
          "stdin": [
            "3",
            "5"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "<"
            }
          ]
        },
        {
          "label": "예시 2 (9 > 2)",
          "stdin": [
            "9",
            "2"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": ">"
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "같은 수 (== 경계)",
          "stdin": [
            "7",
            "7"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "=="
            }
          ]
        },
        {
          "label": "음수 비교",
          "stdin": [
            "-5",
            "-3"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "<"
            }
          ]
        },
        {
          "label": "양수 vs 음수",
          "stdin": [
            "100",
            "-100"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": ">"
            }
          ]
        },
        {
          "label": "0 과 0 (경계)",
          "stdin": [
            "0",
            "0"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "=="
            }
          ]
        }
      ],
      "rubricNote": "세 갈래(>,<,==)를 if/elif/else 로 처리. else 로 '같음'을 잡는 구조 이해가 핵심."
    },
    {
      "id": "prob-2",
      "number": 2,
      "title": "짝수 홀수",
      "difficulty": "easy",
      "prompt": "입력한 정수가 짝수인지 홀수인지 가려 주세요.\n\n짝수는 2 로 나눈 나머지가 0 인 수입니다.\n\n[입력]\n정수 N\n\n[출력]\n짝수면 짝수, 홀수면 홀수 를 출력합니다.",
      "conceptTags": [
        "5강 if/else",
        "4강 나머지 %"
      ],
      "examples": [
        {
          "stdin": [
            "8"
          ],
          "stdout": "짝수"
        },
        {
          "stdin": [
            "3"
          ],
          "stdout": "홀수"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nif n % 2 == 0:\n    print(\"짝수\")\nelse:\n    print(\"홀수\")\n",
      "publicTests": [
        {
          "label": "예시 1 (8 → 짝수)",
          "stdin": [
            "8"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "짝수"
            }
          ]
        },
        {
          "label": "예시 2 (3 → 홀수)",
          "stdin": [
            "3"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "홀수"
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "0 은 짝수 (경계)",
          "stdin": [
            "0"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "짝수"
            }
          ]
        },
        {
          "label": "음수 짝수",
          "stdin": [
            "-4"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "짝수"
            }
          ]
        },
        {
          "label": "음수 홀수",
          "stdin": [
            "-7"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "홀수"
            }
          ]
        },
        {
          "label": "큰 짝수",
          "stdin": [
            "1000000"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "짝수"
            }
          ]
        }
      ],
      "rubricNote": "% 2 로 나머지를 구해 == 0 으로 판정하는 게 핵심. 나머지 개념을 조건에 연결했는지 평가."
    },
    {
      "id": "prob-3",
      "number": 3,
      "title": "학점 계산기",
      "difficulty": "medium",
      "prompt": "점수를 학점으로 바꿔 주는 프로그램을 만들어 주세요. 기준은 다음과 같습니다.\n\n90점 이상: A\n80점 이상 90점 미만: B\n70점 이상 80점 미만: C\n60점 이상 70점 미만: D\n60점 미만: F\n\n[입력]\n0 ~ 100 사이의 정수 점수\n\n[출력]\n해당하는 학점(A/B/C/D/F) 한 글자만 출력합니다.",
      "conceptTags": [
        "5강 if/elif/else"
      ],
      "examples": [
        {
          "stdin": [
            "85"
          ],
          "stdout": "B"
        },
        {
          "stdin": [
            "59"
          ],
          "stdout": "F"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "score = int(input())\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelif score >= 70:\n    print(\"C\")\nelif score >= 60:\n    print(\"D\")\nelse:\n    print(\"F\")\n",
      "publicTests": [
        {
          "label": "예시 1 (85 → B)",
          "stdin": [
            "85"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "B"
            }
          ]
        },
        {
          "label": "예시 2 (59 → F)",
          "stdin": [
            "59"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "F"
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "A 경계 (90)",
          "stdin": [
            "90"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "A"
            }
          ]
        },
        {
          "label": "B 경계 (80)",
          "stdin": [
            "80"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "B"
            }
          ]
        },
        {
          "label": "C 경계 (70)",
          "stdin": [
            "70"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "C"
            }
          ]
        },
        {
          "label": "D 경계 (60)",
          "stdin": [
            "60"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "D"
            }
          ]
        },
        {
          "label": "최저 (0)",
          "stdin": [
            "0"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "F"
            }
          ]
        }
      ],
      "rubricNote": "elif 사다리로 위에서부터 경계를 검사하는 게 핵심. if 를 연속 나열하면 위 조건을 못 막아 논리오류 위험."
    },
    {
      "id": "prob-4",
      "number": 4,
      "title": "세 수 중 최댓값",
      "difficulty": "medium",
      "prompt": "max 같은 편리한 도구 없이, 조건문만으로 세 수 중 가장 큰 값을 찾아 주세요.\n\n[입력]\n첫째 줄: 정수 A\n둘째 줄: 정수 B\n셋째 줄: 정수 C\n\n[출력]\n셋 중 가장 큰 값을 한 줄에 출력합니다. (같은 값이 여럿이면 그 값을 출력합니다.)",
      "conceptTags": [
        "5강 if/elif/else",
        "4강 논리 연산자"
      ],
      "examples": [
        {
          "stdin": [
            "3",
            "7",
            "5"
          ],
          "stdout": "7"
        },
        {
          "stdin": [
            "10",
            "2",
            "9"
          ],
          "stdout": "10"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "a = int(input())\nb = int(input())\nc = int(input())\nif a >= b and a >= c:\n    print(a)\nelif b >= c:\n    print(b)\nelse:\n    print(c)\n",
      "publicTests": [
        {
          "label": "예시 1 (3,7,5 → 7)",
          "stdin": [
            "3",
            "7",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 7
            }
          ]
        },
        {
          "label": "예시 2 (10,2,9 → 10)",
          "stdin": [
            "10",
            "2",
            "9"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 10
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "모두 같음 (경계)",
          "stdin": [
            "5",
            "5",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 5
            }
          ]
        },
        {
          "label": "마지막이 최대",
          "stdin": [
            "1",
            "2",
            "3"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 3
            }
          ]
        },
        {
          "label": "처음이 최대",
          "stdin": [
            "9",
            "1",
            "2"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 9
            }
          ]
        },
        {
          "label": "모두 음수",
          "stdin": [
            "-1",
            "-5",
            "-3"
          ],
          "expect": [
            {
              "kind": "number",
              "value": -1
            }
          ]
        },
        {
          "label": "동점 최대",
          "stdin": [
            "4",
            "4",
            "2"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 4
            }
          ]
        }
      ],
      "rubricNote": "max 없이 and, 비교로 세 수를 견주는 게 핵심. 동점(>=)까지 올바르게 처리했는지 평가."
    },
    {
      "id": "prob-5",
      "number": 5,
      "title": "윤년 판단",
      "difficulty": "hard",
      "prompt": "어떤 해가 윤년인지 판단해 주세요. 윤년 규칙은 이렇습니다.\n\n4 로 나누어떨어지면 윤년입니다.\n단, 100 으로 나누어떨어지면 윤년이 아닙니다.\n그러나 400 으로 나누어떨어지면 다시 윤년입니다.\n\n[입력]\n연도를 나타내는 정수\n\n[출력]\n윤년이면 윤년, 아니면 평년 을 출력합니다.",
      "conceptTags": [
        "5강 조건문",
        "4강 논리 연산자",
        "4강 나머지 %"
      ],
      "examples": [
        {
          "stdin": [
            "2020"
          ],
          "stdout": "윤년"
        },
        {
          "stdin": [
            "1900"
          ],
          "stdout": "평년"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "year = int(input())\nif (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):\n    print(\"윤년\")\nelse:\n    print(\"평년\")\n",
      "publicTests": [
        {
          "label": "예시 1 (2020 → 윤년)",
          "stdin": [
            "2020"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "윤년"
            }
          ]
        },
        {
          "label": "예시 2 (1900 → 평년)",
          "stdin": [
            "1900"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "평년"
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "400 배수 (윤년)",
          "stdin": [
            "2000"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "윤년"
            }
          ]
        },
        {
          "label": "100 배수·400 아님 (평년)",
          "stdin": [
            "2100"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "평년"
            }
          ]
        },
        {
          "label": "4 배수·100 아님 (윤년)",
          "stdin": [
            "2024"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "윤년"
            }
          ]
        },
        {
          "label": "4 배수 아님 (평년)",
          "stdin": [
            "2023"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "평년"
            }
          ]
        },
        {
          "label": "400 배수 (윤년)",
          "stdin": [
            "2400"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "윤년"
            }
          ]
        }
      ],
      "rubricNote": "and, or 조합과 괄호 우선순위가 핵심. 400 예외를 or 로 잡는 구조를 이해했는지 평가."
    },
    {
      "id": "prob-6",
      "number": 6,
      "title": "사분면 고르기",
      "difficulty": "hard",
      "prompt": "좌표평면 위의 점이 어느 사분면에 있는지 알려 주세요. 사분면은 다음과 같이 나뉩니다.\n\n1사분면: x 가 양수, y 가 양수\n2사분면: x 가 음수, y 가 양수\n3사분면: x 가 음수, y 가 음수\n4사분면: x 가 양수, y 가 음수\n\n[입력]\n첫째 줄: 0 이 아닌 정수 x\n둘째 줄: 0 이 아닌 정수 y\n\n[출력]\n사분면 번호(1, 2, 3, 4) 하나만 출력합니다.",
      "conceptTags": [
        "5강 if/elif/else",
        "4강 논리 연산자"
      ],
      "examples": [
        {
          "stdin": [
            "3",
            "4"
          ],
          "stdout": "1"
        },
        {
          "stdin": [
            "-2",
            "5"
          ],
          "stdout": "2"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "x = int(input())\ny = int(input())\nif x > 0 and y > 0:\n    print(1)\nelif x < 0 and y > 0:\n    print(2)\nelif x < 0 and y < 0:\n    print(3)\nelse:\n    print(4)\n",
      "publicTests": [
        {
          "label": "예시 1 (3,4 → 1)",
          "stdin": [
            "3",
            "4"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            }
          ]
        },
        {
          "label": "예시 2 (-2,5 → 2)",
          "stdin": [
            "-2",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 2
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "3사분면 (둘 다 음수)",
          "stdin": [
            "-3",
            "-6"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 3
            }
          ]
        },
        {
          "label": "4사분면 (x양수·y음수)",
          "stdin": [
            "5",
            "-8"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 4
            }
          ]
        },
        {
          "label": "1사분면",
          "stdin": [
            "1",
            "1"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            }
          ]
        },
        {
          "label": "3사분면",
          "stdin": [
            "-1",
            "-1"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 3
            }
          ]
        },
        {
          "label": "4사분면",
          "stdin": [
            "10",
            "-2"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 4
            }
          ]
        }
      ],
      "rubricNote": "x,y 부호 조합을 and 로 판정하는 게 핵심. 네 갈래를 elif 로 나누고 마지막을 else 로 처리했는지 평가."
    }
  ]
};
