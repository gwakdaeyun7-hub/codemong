// 6강 「반복문」 실력향상 문제 6개.
// 지문·스토리·테스트 데이터 전부 자체 제작 (외부 저지는 유형만 참고).
// 2026-07-16 승인 라운드 A-2 확정본 — 수정 시 solutionCode 가 전 테스트를 통과하는지 재검증할 것.

import type { ProblemSet } from "./types";

export const lesson6Problems: ProblemSet = {
  "courseId": "be-python",
  "lessonId": "lesson-6",
  "lessonNumber": 6,
  "title": "반복문",
  "problems": [
    {
      "id": "prob-1",
      "number": 1,
      "title": "1부터 N까지 합",
      "difficulty": "easy",
      "prompt": "1부터 N까지 모든 정수를 더하면 얼마일까요. 누적 변수를 0에서 시작해 하나씩 더해 가며 합을 구해 보세요.\n\n[입력]\n첫째 줄: 정수 N (1 이상)\n\n[출력]\n1부터 N까지의 합을 한 줄에 출력합니다.",
      "conceptTags": [
        "6강 for/range",
        "6강 누적 변수"
      ],
      "examples": [
        {
          "stdin": [
            "10"
          ],
          "stdout": "55"
        },
        {
          "stdin": [
            "5"
          ],
          "stdout": "15"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total = total + i\nprint(total)\n",
      "publicTests": [
        {
          "label": "예시 1 (N=10)",
          "stdin": [
            "10"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 55
            }
          ]
        },
        {
          "label": "예시 2 (N=5)",
          "stdin": [
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 15
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "N=1 (경계)",
          "stdin": [
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
          "label": "N=2",
          "stdin": [
            "2"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 3
            }
          ]
        },
        {
          "label": "N=100",
          "stdin": [
            "100"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 5050
            }
          ]
        },
        {
          "label": "N=1000",
          "stdin": [
            "1000"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 500500
            }
          ]
        }
      ],
      "rubricNote": "누적 변수를 0에서 시작해 반복마다 더하는 흐름이 핵심. 반복 없이 값을 바로 계산했는지 살펴 반복 이해를 평가."
    },
    {
      "id": "prob-2",
      "number": 2,
      "title": "구구단 N단 출력",
      "difficulty": "easy",
      "prompt": "구구단 N단을 외우기 좋게 한 줄씩 보여 주세요. N x 1 부터 N x 9 까지, 곱셈식과 결과를 함께 출력합니다.\n\n출력 형식은 예시와 똑같이 \"N x i = 결과\" 꼴로, 숫자와 x, = 사이를 한 칸씩 띄웁니다.\n\n[입력]\n첫째 줄: 정수 N (1 이상 9 이하)\n\n[출력]\nN단을 9줄에 걸쳐 출력합니다. 첫 줄은 N x 1 = ..., 마지막 줄은 N x 9 = ... 입니다.",
      "conceptTags": [
        "6강 for/range",
        "4강 곱셈"
      ],
      "examples": [
        {
          "stdin": [
            "2"
          ],
          "stdout": "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18"
        },
        {
          "stdin": [
            "5"
          ],
          "stdout": "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nfor i in range(1, 10):\n    print(n, \"x\", i, \"=\", n * i)\n",
      "publicTests": [
        {
          "label": "예시 1 (2단)",
          "stdin": [
            "2"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "2 x 1 = 2"
            },
            {
              "kind": "text",
              "contains": "2 x 2 = 4"
            },
            {
              "kind": "text",
              "contains": "2 x 3 = 6"
            },
            {
              "kind": "text",
              "contains": "2 x 4 = 8"
            },
            {
              "kind": "text",
              "contains": "2 x 5 = 10"
            },
            {
              "kind": "text",
              "contains": "2 x 6 = 12"
            },
            {
              "kind": "text",
              "contains": "2 x 7 = 14"
            },
            {
              "kind": "text",
              "contains": "2 x 8 = 16"
            },
            {
              "kind": "text",
              "contains": "2 x 9 = 18"
            }
          ]
        },
        {
          "label": "예시 2 (5단)",
          "stdin": [
            "5"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "5 x 1 = 5"
            },
            {
              "kind": "text",
              "contains": "5 x 2 = 10"
            },
            {
              "kind": "text",
              "contains": "5 x 3 = 15"
            },
            {
              "kind": "text",
              "contains": "5 x 4 = 20"
            },
            {
              "kind": "text",
              "contains": "5 x 5 = 25"
            },
            {
              "kind": "text",
              "contains": "5 x 6 = 30"
            },
            {
              "kind": "text",
              "contains": "5 x 7 = 35"
            },
            {
              "kind": "text",
              "contains": "5 x 8 = 40"
            },
            {
              "kind": "text",
              "contains": "5 x 9 = 45"
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "1단",
          "stdin": [
            "1"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "1 x 1 = 1"
            },
            {
              "kind": "text",
              "contains": "1 x 2 = 2"
            },
            {
              "kind": "text",
              "contains": "1 x 3 = 3"
            },
            {
              "kind": "text",
              "contains": "1 x 4 = 4"
            },
            {
              "kind": "text",
              "contains": "1 x 5 = 5"
            },
            {
              "kind": "text",
              "contains": "1 x 6 = 6"
            },
            {
              "kind": "text",
              "contains": "1 x 7 = 7"
            },
            {
              "kind": "text",
              "contains": "1 x 8 = 8"
            },
            {
              "kind": "text",
              "contains": "1 x 9 = 9"
            }
          ]
        },
        {
          "label": "9단",
          "stdin": [
            "9"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "9 x 1 = 9"
            },
            {
              "kind": "text",
              "contains": "9 x 2 = 18"
            },
            {
              "kind": "text",
              "contains": "9 x 3 = 27"
            },
            {
              "kind": "text",
              "contains": "9 x 4 = 36"
            },
            {
              "kind": "text",
              "contains": "9 x 5 = 45"
            },
            {
              "kind": "text",
              "contains": "9 x 6 = 54"
            },
            {
              "kind": "text",
              "contains": "9 x 7 = 63"
            },
            {
              "kind": "text",
              "contains": "9 x 8 = 72"
            },
            {
              "kind": "text",
              "contains": "9 x 9 = 81"
            }
          ]
        },
        {
          "label": "3단",
          "stdin": [
            "3"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "3 x 1 = 3"
            },
            {
              "kind": "text",
              "contains": "3 x 2 = 6"
            },
            {
              "kind": "text",
              "contains": "3 x 3 = 9"
            },
            {
              "kind": "text",
              "contains": "3 x 4 = 12"
            },
            {
              "kind": "text",
              "contains": "3 x 5 = 15"
            },
            {
              "kind": "text",
              "contains": "3 x 6 = 18"
            },
            {
              "kind": "text",
              "contains": "3 x 7 = 21"
            },
            {
              "kind": "text",
              "contains": "3 x 8 = 24"
            },
            {
              "kind": "text",
              "contains": "3 x 9 = 27"
            }
          ]
        },
        {
          "label": "7단",
          "stdin": [
            "7"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "7 x 1 = 7"
            },
            {
              "kind": "text",
              "contains": "7 x 2 = 14"
            },
            {
              "kind": "text",
              "contains": "7 x 3 = 21"
            },
            {
              "kind": "text",
              "contains": "7 x 4 = 28"
            },
            {
              "kind": "text",
              "contains": "7 x 5 = 35"
            },
            {
              "kind": "text",
              "contains": "7 x 6 = 42"
            },
            {
              "kind": "text",
              "contains": "7 x 7 = 49"
            },
            {
              "kind": "text",
              "contains": "7 x 8 = 56"
            },
            {
              "kind": "text",
              "contains": "7 x 9 = 63"
            }
          ]
        }
      ],
      "rubricNote": "range(1, 10)로 1부터 9까지 돌며 곱셈식을 출력하는 게 핵심. 출력 형식(N x i = 결과)을 지켰는지 확인."
    },
    {
      "id": "prob-3",
      "number": 3,
      "title": "N개의 수를 입력받아 합 구하기",
      "difficulty": "medium",
      "prompt": "여러 개의 수를 차례로 받아 모두 더해 주세요. 먼저 수가 몇 개인지 알려 주고, 그다음 줄부터 수를 하나씩 입력합니다.\n\n[입력]\n첫째 줄: 수의 개수 N (1 이상)\n다음 N개의 줄: 더할 정수 하나씩\n\n[출력]\n입력한 N개 수의 합을 한 줄에 출력합니다.",
      "conceptTags": [
        "6강 for/range",
        "6강 누적 변수",
        "4강 input()"
      ],
      "examples": [
        {
          "stdin": [
            "3",
            "10",
            "20",
            "30"
          ],
          "stdout": "60"
        },
        {
          "stdin": [
            "4",
            "5",
            "5",
            "5",
            "5"
          ],
          "stdout": "20"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\ntotal = 0\nfor i in range(n):\n    x = int(input())\n    total = total + x\nprint(total)\n",
      "publicTests": [
        {
          "label": "예시 1 (3개)",
          "stdin": [
            "3",
            "10",
            "20",
            "30"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 60
            }
          ]
        },
        {
          "label": "예시 2 (4개)",
          "stdin": [
            "4",
            "5",
            "5",
            "5",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 20
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "N=1 (경계)",
          "stdin": [
            "1",
            "42"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 42
            }
          ]
        },
        {
          "label": "음수 섞임 합 0",
          "stdin": [
            "5",
            "10",
            "-5",
            "3",
            "-8",
            "0"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            }
          ]
        },
        {
          "label": "음수만",
          "stdin": [
            "2",
            "-100",
            "-200"
          ],
          "expect": [
            {
              "kind": "number",
              "value": -300
            }
          ]
        },
        {
          "label": "큰 수 포함",
          "stdin": [
            "3",
            "1000000",
            "1",
            "1"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1000002
            }
          ]
        }
      ],
      "rubricNote": "입력 개수 N만큼 반복하며 누적 변수에 더하는 구조가 핵심. 정해진 횟수 반복을 이해했는지 평가."
    },
    {
      "id": "prob-4",
      "number": 4,
      "title": "N의 약수 모두 출력",
      "difficulty": "medium",
      "prompt": "어떤 수 N의 약수는 N을 나누어떨어지게 하는 수입니다. 1부터 N까지 확인하며 약수를 모두 찾아 작은 수부터 한 줄씩 출력해 주세요.\n\n[입력]\n첫째 줄: 정수 N (1 이상)\n\n[출력]\nN의 약수를 작은 것부터 한 줄에 하나씩 출력합니다.",
      "conceptTags": [
        "6강 for/range",
        "5강 조건문",
        "4강 나머지 %"
      ],
      "examples": [
        {
          "stdin": [
            "6"
          ],
          "stdout": "1\n2\n3\n6"
        },
        {
          "stdin": [
            "7"
          ],
          "stdout": "1\n7"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nfor i in range(1, n + 1):\n    if n % i == 0:\n        print(i)\n",
      "publicTests": [
        {
          "label": "예시 1 (6)",
          "stdin": [
            "6"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            },
            {
              "kind": "number",
              "value": 2
            },
            {
              "kind": "number",
              "value": 3
            },
            {
              "kind": "number",
              "value": 6
            }
          ]
        },
        {
          "label": "예시 2 (7)",
          "stdin": [
            "7"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            },
            {
              "kind": "number",
              "value": 7
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "N=1 (경계)",
          "stdin": [
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
          "label": "약수 많은 12",
          "stdin": [
            "12"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            },
            {
              "kind": "number",
              "value": 2
            },
            {
              "kind": "number",
              "value": 3
            },
            {
              "kind": "number",
              "value": 4
            },
            {
              "kind": "number",
              "value": 6
            },
            {
              "kind": "number",
              "value": 12
            }
          ]
        },
        {
          "label": "소수 13",
          "stdin": [
            "13"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            },
            {
              "kind": "number",
              "value": 13
            }
          ]
        },
        {
          "label": "2의 거듭제곱 16",
          "stdin": [
            "16"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            },
            {
              "kind": "number",
              "value": 2
            },
            {
              "kind": "number",
              "value": 4
            },
            {
              "kind": "number",
              "value": 8
            },
            {
              "kind": "number",
              "value": 16
            }
          ]
        }
      ],
      "rubricNote": "1부터 N까지 돌며 나머지가 0인 수를 약수로 거르는 게 핵심. 나머지 판정과 반복을 연결했는지 평가."
    },
    {
      "id": "prob-5",
      "number": 5,
      "title": "별 찍기",
      "difficulty": "hard",
      "prompt": "별로 계단 모양을 그려 봅시다. 첫 줄에는 별 1개, 둘째 줄에는 별 2개, 이렇게 늘어나 N번째 줄에는 별 N개를 찍습니다.\n\n한 줄에 넣을 별은 빈 문자열에서 시작해 별을 하나씩 이어 붙여 만들 수 있습니다. 반복문 안에 반복문을 넣어 생각해 보세요.\n\n[입력]\n첫째 줄: 정수 N (1 이상)\n\n[출력]\nN개의 줄을 출력합니다. i번째 줄에는 별표(*)를 i개 붙여 출력합니다.",
      "conceptTags": [
        "6강 중첩 for",
        "3강 문자열 누적"
      ],
      "examples": [
        {
          "stdin": [
            "3"
          ],
          "stdout": "*\n**\n***"
        },
        {
          "stdin": [
            "1"
          ],
          "stdout": "*"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nfor i in range(1, n + 1):\n    line = \"\"\n    for j in range(i):\n        line = line + \"*\"\n    print(line)\n",
      "publicTests": [
        {
          "label": "예시 1 (N=3)",
          "stdin": [
            "3"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "*\n**\n***"
            }
          ]
        },
        {
          "label": "예시 2 (N=1, 경계)",
          "stdin": [
            "1"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "*"
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "N=2",
          "stdin": [
            "2"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "*\n**"
            }
          ]
        },
        {
          "label": "N=4",
          "stdin": [
            "4"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "*\n**\n***\n****"
            }
          ]
        },
        {
          "label": "N=5",
          "stdin": [
            "5"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "*\n**\n***\n****\n*****"
            }
          ]
        },
        {
          "label": "N=6",
          "stdin": [
            "6"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "*\n**\n***\n****\n*****\n******"
            }
          ]
        }
      ],
      "rubricNote": "바깥 반복은 줄, 안쪽 반복은 별 개수를 담당하는 중첩 구조가 핵심. 문자열을 하나씩 이어 붙여 만드는 흐름을 이해했는지 평가."
    },
    {
      "id": "prob-6",
      "number": 6,
      "title": "최대공약수",
      "difficulty": "hard",
      "prompt": "두 수를 모두 나누어떨어지게 하는 가장 큰 수를 최대공약수라고 합니다. 두 양의 정수를 입력받아 최대공약수를 구해 주세요.\n\n한 가지 방법은 이렇습니다. 큰 수를 작은 수로 나눈 나머지를 구하고, 작은 수와 그 나머지로 같은 과정을 나머지가 0이 될 때까지 되풀이합니다. 나머지가 0이 되는 순간의 나누는 수가 최대공약수입니다. 나머지가 0이 아닌 동안 반복하는 while 문으로 풀 수 있습니다.\n\n[입력]\n첫째 줄: 정수 A (1 이상)\n둘째 줄: 정수 B (1 이상)\n\n[출력]\nA와 B의 최대공약수를 한 줄에 출력합니다.",
      "conceptTags": [
        "6강 while",
        "4강 나머지 %"
      ],
      "examples": [
        {
          "stdin": [
            "12",
            "18"
          ],
          "stdout": "6"
        },
        {
          "stdin": [
            "8",
            "12"
          ],
          "stdout": "4"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "a = int(input())\nb = int(input())\nwhile b != 0:\n    r = a % b\n    a = b\n    b = r\nprint(a)\n",
      "publicTests": [
        {
          "label": "예시 1 (12, 18)",
          "stdin": [
            "12",
            "18"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 6
            }
          ]
        },
        {
          "label": "예시 2 (8, 12)",
          "stdin": [
            "8",
            "12"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 4
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "서로소",
          "stdin": [
            "7",
            "13"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            }
          ]
        },
        {
          "label": "같은 수",
          "stdin": [
            "10",
            "10"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 10
            }
          ]
        },
        {
          "label": "약수 관계",
          "stdin": [
            "6",
            "24"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 6
            }
          ]
        },
        {
          "label": "1 포함 (경계)",
          "stdin": [
            "1",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            }
          ]
        },
        {
          "label": "여러 번 반복",
          "stdin": [
            "48",
            "36"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 12
            }
          ]
        }
      ],
      "rubricNote": "나머지가 0이 될 때까지 반복하는 while 조건이 핵심. 유클리드 호제법이 아니어도 1부터 두 수까지 훑으며 공약수 중 최대를 찾는 단순 접근 역시 동등한 정답으로 인정하고 감점하지 않는다."
    }
  ]
};
