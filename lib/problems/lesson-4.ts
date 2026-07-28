// 4강 「입력과 연산자」 실력향상 문제 6개.
// 지문·스토리·테스트 데이터 전부 자체 제작 (외부 저지는 유형만 참고).
// 2026-07-16 승인 라운드 A-1 확정본 — 수정 시 solutionCode 가 전 테스트를 통과하는지 재검증할 것.

import type { ProblemSet } from "./types";

export const lesson4Problems: ProblemSet = {
  "courseId": "be-python",
  "lessonId": "lesson-4",
  "lessonNumber": 4,
  "title": "입력과 연산자",
  "problems": [
    {
      "id": "prob-1",
      "number": 1,
      "title": "A+B",
      "difficulty": "easy",
      "prompt": "동아리 회비를 정리하던 코드몽은 두 사람이 낸 금액을 더해야 합니다. 두 정수를 더한 값을 출력하는 프로그램을 만들어 주세요.\n\n[입력]\n첫째 줄: 정수 A\n둘째 줄: 정수 B\n\n[출력]\nA와 B의 합을 한 줄에 출력합니다. (숫자만 출력하세요.)",
      "conceptTags": [
        "4강 input()",
        "4강 int() 형변환",
        "4강 산술 연산자"
      ],
      "examples": [
        {
          "stdin": [
            "3",
            "4"
          ],
          "stdout": "7"
        },
        {
          "stdin": [
            "12",
            "25"
          ],
          "stdout": "37"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "a = int(input())\nb = int(input())\nprint(a + b)\n",
      "publicTests": [
        {
          "label": "예시 1 (3+4)",
          "stdin": [
            "3",
            "4"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 7
            }
          ]
        },
        {
          "label": "예시 2 (12+25)",
          "stdin": [
            "12",
            "25"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 37
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "0 + 0 (0 경계)",
          "stdin": [
            "0",
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
          "label": "음수 + 양수",
          "stdin": [
            "-4",
            "4"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            }
          ]
        },
        {
          "label": "둘 다 음수",
          "stdin": [
            "-10",
            "-20"
          ],
          "expect": [
            {
              "kind": "number",
              "value": -30
            }
          ]
        },
        {
          "label": "큰 수",
          "stdin": [
            "1000000",
            "2000000"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 3000000
            }
          ]
        }
      ],
      "rubricNote": "int() 형변환이 핵심. input() 결과를 그대로 더해 '35'처럼 문자열이 이어붙으면 개념 감점."
    },
    {
      "id": "prob-2",
      "number": 2,
      "title": "사칙연산 5종 출력",
      "difficulty": "easy",
      "prompt": "계산기의 기본기를 연습해 봅시다. 두 정수를 입력받아 다섯 가지 연산 결과를 차례로 보여 주세요.\n\n[입력]\n첫째 줄: 정수 A\n둘째 줄: 정수 B (B 는 0 이 아닙니다)\n\n[출력] 다음 다섯 값을 각 줄에 하나씩, 이 순서대로 출력합니다.\n1) 합 A + B\n2) 차 A - B\n3) 곱 A * B\n4) 몫 A // B\n5) 나머지 A % B",
      "conceptTags": [
        "4강 산술 연산자",
        "4강 몫 //",
        "4강 나머지 %"
      ],
      "examples": [
        {
          "stdin": [
            "7",
            "3"
          ],
          "stdout": "10\n4\n21\n2\n1"
        },
        {
          "stdin": [
            "20",
            "6"
          ],
          "stdout": "26\n14\n120\n3\n2"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "a = int(input())\nb = int(input())\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a // b)\nprint(a % b)\n",
      "publicTests": [
        {
          "label": "예시 1 (7, 3)",
          "stdin": [
            "7",
            "3"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 10
            },
            {
              "kind": "number",
              "value": 4
            },
            {
              "kind": "number",
              "value": 21
            },
            {
              "kind": "number",
              "value": 2
            },
            {
              "kind": "number",
              "value": 1
            }
          ]
        },
        {
          "label": "예시 2 (20, 6)",
          "stdin": [
            "20",
            "6"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 26
            },
            {
              "kind": "number",
              "value": 14
            },
            {
              "kind": "number",
              "value": 120
            },
            {
              "kind": "number",
              "value": 3
            },
            {
              "kind": "number",
              "value": 2
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "나눠떨어짐 (나머지 0)",
          "stdin": [
            "8",
            "4"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 12
            },
            {
              "kind": "number",
              "value": 4
            },
            {
              "kind": "number",
              "value": 32
            },
            {
              "kind": "number",
              "value": 2
            },
            {
              "kind": "number",
              "value": 0
            }
          ]
        },
        {
          "label": "A<B (차 음수·몫 0)",
          "stdin": [
            "3",
            "8"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 11
            },
            {
              "kind": "number",
              "value": -5
            },
            {
              "kind": "number",
              "value": 24
            },
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 3
            }
          ]
        },
        {
          "label": "두 자리 몫",
          "stdin": [
            "100",
            "7"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 107
            },
            {
              "kind": "number",
              "value": 93
            },
            {
              "kind": "number",
              "value": 700
            },
            {
              "kind": "number",
              "value": 14
            },
            {
              "kind": "number",
              "value": 2
            }
          ]
        },
        {
          "label": "같은 수",
          "stdin": [
            "5",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 10
            },
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 25
            },
            {
              "kind": "number",
              "value": 1
            },
            {
              "kind": "number",
              "value": 0
            }
          ]
        }
      ],
      "rubricNote": "몫 //, 곱 *, 나머지 % 를 구분해 다섯 값을 정확한 순서로 출력하는지가 핵심. 순서가 어긋나면 개념 감점."
    },
    {
      "id": "prob-3",
      "number": 3,
      "title": "분→시간 변환",
      "difficulty": "medium",
      "prompt": "스톱워치가 잰 시간이 '분' 단위로만 남았습니다. 이 총 분을 몇 시간 몇 분인지로 바꿔 주세요.\n\n예를 들어 150분은 2시간 30분입니다.\n\n[입력]\n총 시간(분)을 나타내는 0 이상의 정수 M\n\n[출력]\n첫째 줄: 시간 (M 을 60 으로 나눈 몫)\n둘째 줄: 남은 분 (M 을 60 으로 나눈 나머지)\n숫자만 각 줄에 출력하세요.",
      "conceptTags": [
        "4강 몫 //",
        "4강 나머지 %",
        "4강 input()"
      ],
      "examples": [
        {
          "stdin": [
            "150"
          ],
          "stdout": "2\n30"
        },
        {
          "stdin": [
            "45"
          ],
          "stdout": "0\n45"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "m = int(input())\nprint(m // 60)\nprint(m % 60)\n",
      "publicTests": [
        {
          "label": "예시 1 (150분)",
          "stdin": [
            "150"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 2
            },
            {
              "kind": "number",
              "value": 30
            }
          ]
        },
        {
          "label": "예시 2 (45분)",
          "stdin": [
            "45"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 45
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "정확히 1시간 (경계)",
          "stdin": [
            "60"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            },
            {
              "kind": "number",
              "value": 0
            }
          ]
        },
        {
          "label": "1시간 직전 (경계)",
          "stdin": [
            "59"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 59
            }
          ]
        },
        {
          "label": "0분 (경계)",
          "stdin": [
            "0"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 0
            }
          ]
        },
        {
          "label": "여러 시간",
          "stdin": [
            "605"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 10
            },
            {
              "kind": "number",
              "value": 5
            }
          ]
        }
      ],
      "rubricNote": "// 로 시간(몫), % 로 분(나머지)을 얻는 게 핵심. 둘을 바꿔 쓰면 개념 감점."
    },
    {
      "id": "prob-4",
      "number": 4,
      "title": "거스름돈 동전 개수",
      "difficulty": "medium",
      "prompt": "자판기가 거스름돈을 500원과 100원 동전으로만 내어 줍니다. 되도록 큰 동전을 먼저 쓸 때, 각 동전이 몇 개 필요한지 구해 주세요.\n\n[입력]\n거스름돈 금액 (100원 단위의 0 이상 정수)\n\n[출력]\n첫째 줄: 500원 동전 개수\n둘째 줄: 100원 동전 개수\n숫자만 각 줄에 출력하세요.",
      "conceptTags": [
        "4강 몫 //",
        "4강 나머지 %"
      ],
      "examples": [
        {
          "stdin": [
            "1300"
          ],
          "stdout": "2\n3"
        },
        {
          "stdin": [
            "800"
          ],
          "stdout": "1\n3"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "money = int(input())\nc500 = money // 500\nrest = money % 500\nc100 = rest // 100\nprint(c500)\nprint(c100)\n",
      "publicTests": [
        {
          "label": "예시 1 (1300원)",
          "stdin": [
            "1300"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 2
            },
            {
              "kind": "number",
              "value": 3
            }
          ]
        },
        {
          "label": "예시 2 (800원)",
          "stdin": [
            "800"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            },
            {
              "kind": "number",
              "value": 3
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "500원 하나 (경계)",
          "stdin": [
            "500"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            },
            {
              "kind": "number",
              "value": 0
            }
          ]
        },
        {
          "label": "500원 없음",
          "stdin": [
            "400"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 4
            }
          ]
        },
        {
          "label": "0원 (경계)",
          "stdin": [
            "0"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 0
            }
          ]
        },
        {
          "label": "큰 금액",
          "stdin": [
            "2900"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 5
            },
            {
              "kind": "number",
              "value": 4
            }
          ]
        },
        {
          "label": "500 하나 + 100 넷",
          "stdin": [
            "900"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            },
            {
              "kind": "number",
              "value": 4
            }
          ]
        }
      ],
      "rubricNote": "큰 동전부터 // 로 개수를 세고 % 로 남은 금액을 넘기는 그리디 흐름이 핵심."
    },
    {
      "id": "prob-5",
      "number": 5,
      "title": "세 과목 평균",
      "difficulty": "medium",
      "prompt": "국어, 영어, 수학 세 과목의 점수를 받아 평균을 구하려 합니다. 평균은 소수점까지 정확히 나와야 합니다.\n\n[입력]\n첫째 줄: 첫 번째 점수\n둘째 줄: 두 번째 점수\n셋째 줄: 세 번째 점수\n\n[출력]\n세 점수의 평균을 한 줄에 출력합니다. (나눗셈 / 를 사용하세요.)",
      "conceptTags": [
        "4강 산술 연산자",
        "4강 나눗셈 /"
      ],
      "examples": [
        {
          "stdin": [
            "90",
            "80",
            "70"
          ],
          "stdout": "80.0"
        },
        {
          "stdin": [
            "100",
            "90",
            "80"
          ],
          "stdout": "90.0"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "a = int(input())\nb = int(input())\nc = int(input())\nprint((a + b + c) / 3)\n",
      "publicTests": [
        {
          "label": "예시 1 (90/80/70)",
          "stdin": [
            "90",
            "80",
            "70"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 80
            }
          ]
        },
        {
          "label": "예시 2 (100/90/80)",
          "stdin": [
            "100",
            "90",
            "80"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 90
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "안 나눠떨어지는 평균 (// 쓰면 틀림)",
          "stdin": [
            "70",
            "80",
            "95"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 81.66666666666667
            }
          ]
        },
        {
          "label": "만점",
          "stdin": [
            "100",
            "100",
            "100"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 100
            }
          ]
        },
        {
          "label": "모두 0 (경계)",
          "stdin": [
            "0",
            "0",
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
          "label": "소수 평균",
          "stdin": [
            "100",
            "100",
            "99"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 99.66666666666667
            }
          ]
        }
      ],
      "rubricNote": "/ 로 실수 나눗셈을 해야 함. // 를 쓰면 소수점이 잘려 논리오류."
    },
    {
      "id": "prob-6",
      "number": 6,
      "title": "자릿수 분해 곱셈",
      "difficulty": "hard",
      "prompt": "종이에 곱셈을 할 때 우리는 한 자리씩 나눠서 곱한 뒤 더합니다. 그 과정을 프로그램으로 보여 주세요.\n\n세 자리 정수 A 와 정수 B 를 입력받아, A 의 일의 자리, 십의 자리, 백의 자리 숫자에 각각 B 를 곱한 값을 차례로 출력하고, 마지막에 전체 곱 A × B 를 출력합니다.\n\n[입력]\n첫째 줄: 세 자리 정수 A (100 ~ 999)\n둘째 줄: 정수 B\n\n[출력] 각 줄에 하나씩, 이 순서대로.\n1) (A 의 일의 자리 숫자) × B\n2) (A 의 십의 자리 숫자) × B\n3) (A 의 백의 자리 숫자) × B\n4) A × B\n숫자만 출력하세요.",
      "conceptTags": [
        "4강 몫 //",
        "4강 나머지 %",
        "4강 산술 연산자"
      ],
      "examples": [
        {
          "stdin": [
            "123",
            "456"
          ],
          "stdout": "1368\n912\n456\n56088"
        },
        {
          "stdin": [
            "205",
            "3"
          ],
          "stdout": "15\n0\n6\n615"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "a = int(input())\nb = int(input())\nones = a % 10\ntens = (a // 10) % 10\nhundreds = a // 100\nprint(ones * b)\nprint(tens * b)\nprint(hundreds * b)\nprint(a * b)\n",
      "publicTests": [
        {
          "label": "예시 1 (123 × 456)",
          "stdin": [
            "123",
            "456"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1368
            },
            {
              "kind": "number",
              "value": 912
            },
            {
              "kind": "number",
              "value": 456
            },
            {
              "kind": "number",
              "value": 56088
            }
          ]
        },
        {
          "label": "예시 2 (205 × 3)",
          "stdin": [
            "205",
            "3"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 15
            },
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 6
            },
            {
              "kind": "number",
              "value": 615
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "모든 자리 9 (최대)",
          "stdin": [
            "999",
            "999"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 8991
            },
            {
              "kind": "number",
              "value": 8991
            },
            {
              "kind": "number",
              "value": 8991
            },
            {
              "kind": "number",
              "value": 998001
            }
          ]
        },
        {
          "label": "가운데·끝 자리 0 (경계)",
          "stdin": [
            "100",
            "100"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 100
            },
            {
              "kind": "number",
              "value": 10000
            }
          ]
        },
        {
          "label": "일·십 자리 0",
          "stdin": [
            "500",
            "7"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 0
            },
            {
              "kind": "number",
              "value": 35
            },
            {
              "kind": "number",
              "value": 3500
            }
          ]
        },
        {
          "label": "자리별 값 확인",
          "stdin": [
            "321",
            "10"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 10
            },
            {
              "kind": "number",
              "value": 20
            },
            {
              "kind": "number",
              "value": 30
            },
            {
              "kind": "number",
              "value": 3210
            }
          ]
        }
      ],
      "rubricNote": "// 와 % 조합으로 각 자리 숫자를 뽑아 자리값에 맞춰 곱하는 흐름이 핵심. 자리 추출 공식을 이해했는지 평가."
    }
  ]
};
