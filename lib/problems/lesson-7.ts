// 7강 「리스트」 실력향상 문제 6개.
// 지문·스토리·테스트 데이터 전부 자체 제작 (외부 저지는 유형만 참고).
// 2026-07-16 승인 라운드 A-2 확정본 — 수정 시 solutionCode 가 전 테스트를 통과하는지 재검증할 것.

import type { ProblemSet } from "./types";

export const lesson7Problems: ProblemSet = {
  "courseId": "be-python",
  "lessonId": "lesson-7",
  "lessonNumber": 7,
  "title": "리스트",
  "problems": [
    {
      "id": "prob-1",
      "number": 1,
      "title": "N개 중 최댓값 찾기",
      "difficulty": "easy",
      "prompt": "여러 개의 수 중에서 가장 큰 값을 찾아 주세요. 파이썬에는 최댓값을 바로 구해 주는 도구가 있지만, 이번에는 쓰지 않고 리스트를 직접 훑어 가며 찾습니다.\n\n[입력]\n첫째 줄: 수의 개수 N (1 이상)\n다음 N개의 줄: 정수 하나씩\n\n[출력]\nN개의 수 중 가장 큰 값을 한 줄에 출력합니다.",
      "conceptTags": [
        "7강 리스트",
        "7강 for 순회",
        "5강 조건문"
      ],
      "examples": [
        {
          "stdin": [
            "3",
            "3",
            "7",
            "5"
          ],
          "stdout": "7"
        },
        {
          "stdin": [
            "4",
            "10",
            "2",
            "9",
            "4"
          ],
          "stdout": "10"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nnums = []\nfor i in range(n):\n    nums.append(int(input()))\nbiggest = nums[0]\nfor x in nums:\n    if x > biggest:\n        biggest = x\nprint(biggest)\n",
      "publicTests": [
        {
          "label": "예시 1 (3개)",
          "stdin": [
            "3",
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
          "label": "예시 2 (4개)",
          "stdin": [
            "4",
            "10",
            "2",
            "9",
            "4"
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
          "label": "전부 음수",
          "stdin": [
            "3",
            "-5",
            "-2",
            "-9"
          ],
          "expect": [
            {
              "kind": "number",
              "value": -2
            }
          ]
        },
        {
          "label": "동점 최댓값",
          "stdin": [
            "3",
            "8",
            "8",
            "3"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 8
            }
          ]
        },
        {
          "label": "첫 값이 최대",
          "stdin": [
            "5",
            "5",
            "4",
            "3",
            "2",
            "1"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 5
            }
          ]
        }
      ],
      "rubricNote": "리스트를 훑으며 현재까지의 최댓값을 갱신하는 흐름이 핵심. 내장 최댓값 도구 없이 직접 비교했는지 평가."
    },
    {
      "id": "prob-2",
      "number": 2,
      "title": "거꾸로 출력",
      "difficulty": "easy",
      "prompt": "입력한 수들을 마지막에 넣은 것부터 거꾸로 다시 출력해 주세요.\n\n[입력]\n첫째 줄: 수의 개수 N (1 이상)\n다음 N개의 줄: 정수 하나씩\n\n[출력]\n입력한 수를 역순으로 한 줄에 하나씩 출력합니다.",
      "conceptTags": [
        "7강 리스트",
        "7강 인덱싱",
        "6강 for/range"
      ],
      "examples": [
        {
          "stdin": [
            "3",
            "1",
            "2",
            "3"
          ],
          "stdout": "3\n2\n1"
        },
        {
          "stdin": [
            "4",
            "10",
            "20",
            "30",
            "40"
          ],
          "stdout": "40\n30\n20\n10"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nnums = []\nfor i in range(n):\n    nums.append(int(input()))\nfor i in range(n - 1, -1, -1):\n    print(nums[i])\n",
      "publicTests": [
        {
          "label": "예시 1 (3개)",
          "stdin": [
            "3",
            "1",
            "2",
            "3"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 3
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
          "label": "예시 2 (4개)",
          "stdin": [
            "4",
            "10",
            "20",
            "30",
            "40"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 40
            },
            {
              "kind": "number",
              "value": 30
            },
            {
              "kind": "number",
              "value": 20
            },
            {
              "kind": "number",
              "value": 10
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "N=1 (경계)",
          "stdin": [
            "1",
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
          "label": "N=2",
          "stdin": [
            "2",
            "7",
            "8"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 8
            },
            {
              "kind": "number",
              "value": 7
            }
          ]
        },
        {
          "label": "음수",
          "stdin": [
            "3",
            "-1",
            "-2",
            "-3"
          ],
          "expect": [
            {
              "kind": "number",
              "value": -3
            },
            {
              "kind": "number",
              "value": -2
            },
            {
              "kind": "number",
              "value": -1
            }
          ]
        },
        {
          "label": "오름차순 입력",
          "stdin": [
            "5",
            "1",
            "2",
            "3",
            "4",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 5
            },
            {
              "kind": "number",
              "value": 4
            },
            {
              "kind": "number",
              "value": 3
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
        }
      ],
      "rubricNote": "인덱스를 뒤에서 앞으로 접근하거나 역순 반복으로 거꾸로 출력하는 게 핵심."
    },
    {
      "id": "prob-3",
      "number": 3,
      "title": "최댓값과 그 위치",
      "difficulty": "medium",
      "prompt": "가장 큰 수가 무엇인지, 그리고 그 수가 몇 번째에 있는지 함께 알려 주세요. 위치는 첫 번째를 1로 세고, 같은 최댓값이 여럿이면 가장 먼저 나오는 위치를 답합니다.\n\n[입력]\n첫째 줄: 수의 개수 N (1 이상)\n다음 N개의 줄: 정수 하나씩\n\n[출력]\n첫째 줄: 가장 큰 값\n둘째 줄: 그 값이 처음 나오는 위치 (1부터 셈)",
      "conceptTags": [
        "7강 리스트",
        "7강 인덱싱",
        "5강 조건문"
      ],
      "examples": [
        {
          "stdin": [
            "3",
            "3",
            "7",
            "5"
          ],
          "stdout": "7\n2"
        },
        {
          "stdin": [
            "4",
            "10",
            "2",
            "9",
            "4"
          ],
          "stdout": "10\n1"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nnums = []\nfor i in range(n):\n    nums.append(int(input()))\nbiggest = nums[0]\npos = 0\nfor i in range(n):\n    if nums[i] > biggest:\n        biggest = nums[i]\n        pos = i\nprint(biggest)\nprint(pos + 1)\n",
      "publicTests": [
        {
          "label": "예시 1 (최댓값 7, 2번째)",
          "stdin": [
            "3",
            "3",
            "7",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 7
            },
            {
              "kind": "number",
              "value": 2
            }
          ]
        },
        {
          "label": "예시 2 (최댓값 10, 1번째)",
          "stdin": [
            "4",
            "10",
            "2",
            "9",
            "4"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 10
            },
            {
              "kind": "number",
              "value": 1
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
            },
            {
              "kind": "number",
              "value": 1
            }
          ]
        },
        {
          "label": "동점 첫 위치",
          "stdin": [
            "3",
            "8",
            "8",
            "3"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 8
            },
            {
              "kind": "number",
              "value": 1
            }
          ]
        },
        {
          "label": "마지막이 최대",
          "stdin": [
            "3",
            "1",
            "2",
            "3"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 3
            },
            {
              "kind": "number",
              "value": 3
            }
          ]
        },
        {
          "label": "음수 최댓값",
          "stdin": [
            "3",
            "-5",
            "-2",
            "-9"
          ],
          "expect": [
            {
              "kind": "number",
              "value": -2
            },
            {
              "kind": "number",
              "value": 2
            }
          ]
        }
      ],
      "rubricNote": "값과 위치를 함께 갱신하고 위치를 1부터 세는 처리가 핵심. 동점일 때 첫 위치를 지켰는지 평가."
    },
    {
      "id": "prob-4",
      "number": 4,
      "title": "평균 넘는 수 세기",
      "difficulty": "medium",
      "prompt": "점수 여러 개를 받아 평균을 구하고, 평균보다 높은 점수가 몇 개인지 세어 주세요. 평균과 정확히 같은 점수는 세지 않습니다.\n\n먼저 전체를 한 번 훑어 합과 평균을 구한 뒤, 다시 한 번 훑으며 평균을 넘는 개수를 셉니다.\n\n[입력]\n첫째 줄: 수의 개수 N (1 이상)\n다음 N개의 줄: 정수 하나씩\n\n[출력]\n평균보다 큰 수의 개수를 한 줄에 출력합니다.",
      "conceptTags": [
        "7강 리스트",
        "6강 for/range",
        "4강 나눗셈 /"
      ],
      "examples": [
        {
          "stdin": [
            "4",
            "50",
            "60",
            "70",
            "80"
          ],
          "stdout": "2"
        },
        {
          "stdin": [
            "3",
            "10",
            "20",
            "30"
          ],
          "stdout": "1"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nnums = []\nfor i in range(n):\n    nums.append(int(input()))\ntotal = 0\nfor x in nums:\n    total = total + x\navg = total / n\ncount = 0\nfor x in nums:\n    if x > avg:\n        count = count + 1\nprint(count)\n",
      "publicTests": [
        {
          "label": "예시 1 (4개, 평균 65)",
          "stdin": [
            "4",
            "50",
            "60",
            "70",
            "80"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 2
            }
          ]
        },
        {
          "label": "예시 2 (3개, 평균 20)",
          "stdin": [
            "3",
            "10",
            "20",
            "30"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "N=1 (경계, 자기 자신은 평균과 같음)",
          "stdin": [
            "1",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            }
          ]
        },
        {
          "label": "전부 동일값",
          "stdin": [
            "3",
            "7",
            "7",
            "7"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 0
            }
          ]
        },
        {
          "label": "한 값만 튐",
          "stdin": [
            "5",
            "1",
            "2",
            "3",
            "4",
            "100"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            }
          ]
        },
        {
          "label": "음수 평균",
          "stdin": [
            "4",
            "-10",
            "-20",
            "-30",
            "0"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 2
            }
          ]
        }
      ],
      "rubricNote": "합과 평균을 먼저 구하고 다시 훑어 세는 두 번 순회 구조가 핵심. 평균과 같은 값을 제외했는지 평가."
    },
    {
      "id": "prob-5",
      "number": 5,
      "title": "짝수만 골라 새 리스트",
      "difficulty": "medium",
      "prompt": "여러 수 중에서 짝수만 골라 모은 뒤, 모은 순서대로 출력해 주세요. 새 리스트를 하나 만들어 짝수를 만날 때마다 끝에 붙이면 됩니다.\n\n[입력]\n첫째 줄: 수의 개수 N (1 이상)\n다음 N개의 줄: 정수 하나씩\n\n[출력]\n입력에 나온 순서를 지키며 짝수만 한 줄에 하나씩 출력합니다.",
      "conceptTags": [
        "7강 리스트",
        "7강 append",
        "5강 조건문"
      ],
      "examples": [
        {
          "stdin": [
            "5",
            "1",
            "2",
            "3",
            "4",
            "5"
          ],
          "stdout": "2\n4"
        },
        {
          "stdin": [
            "4",
            "10",
            "15",
            "20",
            "25"
          ],
          "stdout": "10\n20"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nevens = []\nfor i in range(n):\n    x = int(input())\n    if x % 2 == 0:\n        evens.append(x)\nfor e in evens:\n    print(e)\n",
      "publicTests": [
        {
          "label": "예시 1 (5개 중 짝수 2,4)",
          "stdin": [
            "5",
            "1",
            "2",
            "3",
            "4",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 2
            },
            {
              "kind": "number",
              "value": 4
            }
          ]
        },
        {
          "label": "예시 2 (4개 중 짝수 10,20)",
          "stdin": [
            "4",
            "10",
            "15",
            "20",
            "25"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 10
            },
            {
              "kind": "number",
              "value": 20
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "짝수 하나 (경계)",
          "stdin": [
            "1",
            "4"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 4
            }
          ]
        },
        {
          "label": "전부 짝수",
          "stdin": [
            "3",
            "2",
            "4",
            "6"
          ],
          "expect": [
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
              "value": 6
            }
          ]
        },
        {
          "label": "순서 유지",
          "stdin": [
            "6",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 12
            },
            {
              "kind": "number",
              "value": 14
            },
            {
              "kind": "number",
              "value": 16
            }
          ]
        },
        {
          "label": "음수 짝수",
          "stdin": [
            "4",
            "-2",
            "-3",
            "-4",
            "-5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": -2
            },
            {
              "kind": "number",
              "value": -4
            }
          ]
        }
      ],
      "rubricNote": "짝수를 만날 때마다 새 리스트에 append 하고 순서를 지켜 출력하는 게 핵심."
    },
    {
      "id": "prob-6",
      "number": 6,
      "title": "두 번째로 큰 수",
      "difficulty": "hard",
      "prompt": "가장 큰 수 다음으로 큰 값을 찾아 주세요. 정렬 기능은 쓰지 않고 리스트를 직접 훑어서 구합니다. 같은 값이 여러 번 나와도 서로 다른 값들 가운데 두 번째로 큰 값을 답합니다. 입력에는 서로 다른 값이 적어도 두 개 있습니다.\n\n[입력]\n첫째 줄: 수의 개수 N (2 이상)\n다음 N개의 줄: 정수 하나씩\n\n[출력]\n두 번째로 큰 값을 한 줄에 출력합니다.",
      "conceptTags": [
        "7강 리스트",
        "7강 for 순회",
        "5강 조건문"
      ],
      "examples": [
        {
          "stdin": [
            "3",
            "3",
            "7",
            "5"
          ],
          "stdout": "5"
        },
        {
          "stdin": [
            "4",
            "10",
            "2",
            "9",
            "4"
          ],
          "stdout": "9"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nnums = []\nfor i in range(n):\n    nums.append(int(input()))\nfirst = nums[0]\nfor x in nums:\n    if x > first:\n        first = x\nsecond = first\nfound = False\nfor x in nums:\n    if x < first:\n        if found == False:\n            second = x\n            found = True\n        elif x > second:\n            second = x\nprint(second)\n",
      "publicTests": [
        {
          "label": "예시 1 (두 번째 5)",
          "stdin": [
            "3",
            "3",
            "7",
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
          "label": "예시 2 (두 번째 9)",
          "stdin": [
            "4",
            "10",
            "2",
            "9",
            "4"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 9
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "N=2 (경계 최소 크기)",
          "stdin": [
            "2",
            "5",
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
          "label": "최댓값 중복",
          "stdin": [
            "4",
            "7",
            "3",
            "7",
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
          "label": "음수",
          "stdin": [
            "3",
            "-1",
            "-2",
            "-3"
          ],
          "expect": [
            {
              "kind": "number",
              "value": -2
            }
          ]
        },
        {
          "label": "중복 여럿",
          "stdin": [
            "5",
            "10",
            "10",
            "8",
            "8",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 8
            }
          ]
        }
      ],
      "rubricNote": "최댓값을 찾은 뒤 그보다 작은 값 중 최댓값을 찾는 두 단계가 핵심. 정렬 없이 순회로 구했는지, 중복을 제대로 걸렀는지 평가."
    }
  ]
};
