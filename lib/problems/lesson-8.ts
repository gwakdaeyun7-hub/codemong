// 8강 「딕셔너리, 자료구조」 실력향상 문제 5개.
// 지문·스토리·테스트 데이터 전부 자체 제작 (외부 저지는 유형만 참고).
// 2026-07-16 승인 라운드 A-3 확정본 — 수정 시 solutionCode 가 전 테스트를 통과하는지 재검증할 것.

import type { ProblemSet } from "./types";

export const lesson8Problems: ProblemSet = {
  "courseId": "be-python",
  "lessonId": "lesson-8",
  "lessonNumber": 8,
  "title": "딕셔너리, 자료구조",
  "problems": [
    {
      "id": "prob-1",
      "number": 1,
      "title": "단어장 조회",
      "difficulty": "easy",
      "prompt": "영어 단어와 뜻을 담은 작은 단어장이 있습니다. 사용자가 찾는 단어의 뜻을 알려 주고, 단어장에 없는 단어라면 그렇다고 알려 주세요.\n\n단어장은 apple은 사과, banana는 바나나, cat은 고양이 이렇게 세 단어로 코드 안에 미리 만들어 둡니다.\n\n[입력]\n첫째 줄: 찾을 단어 하나\n\n[출력]\n단어장에 있으면 그 뜻을, 없으면 없는 단어 를 출력합니다.",
      "conceptTags": [
        "8강 딕셔너리",
        "8강 in",
        "5강 조건문"
      ],
      "examples": [
        {
          "stdin": [
            "apple"
          ],
          "stdout": "사과"
        },
        {
          "stdin": [
            "dog"
          ],
          "stdout": "없는 단어"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "사전 = {\"apple\": \"사과\", \"banana\": \"바나나\", \"cat\": \"고양이\"}\nword = input()\nif word in 사전:\n    print(사전[word])\nelse:\n    print(\"없는 단어\")\n",
      "publicTests": [
        {
          "label": "예시 1 (apple)",
          "stdin": [
            "apple"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "사과"
            }
          ]
        },
        {
          "label": "예시 2 (dog, 미등록)",
          "stdin": [
            "dog"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "없는 단어"
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "banana",
          "stdin": [
            "banana"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "바나나"
            }
          ]
        },
        {
          "label": "cat",
          "stdin": [
            "cat"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "고양이"
            }
          ]
        },
        {
          "label": "elephant (경계, 미등록)",
          "stdin": [
            "elephant"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "없는 단어"
            }
          ]
        },
        {
          "label": "apple 재확인",
          "stdin": [
            "apple"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "사과"
            }
          ]
        }
      ],
      "rubricNote": "딕셔너리를 키로 조회하기 전에 in 으로 존재 여부를 먼저 확인하는 게 핵심. 없는 키 접근 처리를 이해했는지 평가."
    },
    {
      "id": "prob-2",
      "number": 2,
      "title": "중복 없는 수 개수",
      "difficulty": "medium",
      "prompt": "수를 여러 개 입력받는데 같은 수가 여러 번 나올 수 있습니다. 서로 다른 수가 몇 종류인지 세어 주세요. 셋(set)에 담으면 중복이 저절로 사라집니다.\n\n[입력]\n첫째 줄: 수의 개수 N (1 이상)\n다음 N개의 줄: 정수 하나씩\n\n[출력]\n서로 다른 수가 몇 개인지 한 줄에 출력합니다.",
      "conceptTags": [
        "8강 셋",
        "7강 리스트",
        "7강 len"
      ],
      "examples": [
        {
          "stdin": [
            "5",
            "1",
            "2",
            "2",
            "3",
            "3"
          ],
          "stdout": "3"
        },
        {
          "stdin": [
            "4",
            "7",
            "7",
            "7",
            "7"
          ],
          "stdout": "1"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\nnums = []\nfor i in range(n):\n    nums.append(int(input()))\nunique = set(nums)\nprint(len(unique))\n",
      "publicTests": [
        {
          "label": "예시 1 (5개, 3종)",
          "stdin": [
            "5",
            "1",
            "2",
            "2",
            "3",
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
          "label": "예시 2 (4개, 1종)",
          "stdin": [
            "4",
            "7",
            "7",
            "7",
            "7"
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
          "label": "N=1 (경계)",
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
          "label": "전부 다름",
          "stdin": [
            "4",
            "1",
            "2",
            "3",
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
          "label": "음수+중복",
          "stdin": [
            "5",
            "-1",
            "-1",
            "2",
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
          "label": "모두 같음",
          "stdin": [
            "3",
            "10",
            "10",
            "10"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 1
            }
          ]
        }
      ],
      "rubricNote": "리스트를 셋으로 바꿔 중복을 없앤 뒤 개수를 세는 흐름이 핵심. 셋이 중복을 자동으로 제거한다는 성질을 활용했는지 평가."
    },
    {
      "id": "prob-3",
      "number": 3,
      "title": "단어 빈도 세기",
      "difficulty": "medium",
      "prompt": "단어가 여러 개 들어옵니다. 각 단어가 몇 번 나왔는지 세어, 처음 나온 순서대로 단어와 횟수를 함께 출력해 주세요.\n\n딕셔너리에 단어별 횟수를 쌓고, 처음 본 단어의 순서를 따로 기억해 두면 순서대로 출력할 수 있습니다.\n\n[입력]\n첫째 줄: 단어의 개수 N (1 이상)\n다음 N개의 줄: 단어 하나씩\n\n[출력]\n처음 나온 순서대로, 한 줄에 단어와 나온 횟수를 빈칸으로 띄워 출력합니다. 예를 들어 사과가 3번이면 사과 3 처럼 출력합니다.",
      "conceptTags": [
        "8강 딕셔너리",
        "7강 리스트",
        "5강 조건문"
      ],
      "examples": [
        {
          "stdin": [
            "5",
            "사과",
            "바나나",
            "사과",
            "사과",
            "바나나"
          ],
          "stdout": "사과 3\n바나나 2"
        },
        {
          "stdin": [
            "3",
            "귤",
            "귤",
            "사과"
          ],
          "stdout": "귤 2\n사과 1"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\norder = []\ncount = {}\nfor i in range(n):\n    word = input()\n    if word in count:\n        count[word] = count[word] + 1\n    else:\n        count[word] = 1\n        order.append(word)\nfor w in order:\n    print(w, count[w])\n",
      "publicTests": [
        {
          "label": "예시 1 (사과3 바나나2)",
          "stdin": [
            "5",
            "사과",
            "바나나",
            "사과",
            "사과",
            "바나나"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "사과 3"
            },
            {
              "kind": "text",
              "contains": "바나나 2"
            }
          ]
        },
        {
          "label": "예시 2 (귤2 사과1)",
          "stdin": [
            "3",
            "귤",
            "귤",
            "사과"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "귤 2"
            },
            {
              "kind": "text",
              "contains": "사과 1"
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "N=1 (경계)",
          "stdin": [
            "1",
            "포도"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "포도 1"
            }
          ]
        },
        {
          "label": "같은 단어만",
          "stdin": [
            "4",
            "사과",
            "사과",
            "사과",
            "사과"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "사과 4"
            }
          ]
        },
        {
          "label": "전부 1회, 순서 유지",
          "stdin": [
            "3",
            "사과",
            "바나나",
            "포도"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "사과 1"
            },
            {
              "kind": "text",
              "contains": "바나나 1"
            },
            {
              "kind": "text",
              "contains": "포도 1"
            }
          ]
        },
        {
          "label": "섞인 빈도",
          "stdin": [
            "6",
            "가",
            "나",
            "가",
            "다",
            "나",
            "가"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "가 3"
            },
            {
              "kind": "text",
              "contains": "나 2"
            },
            {
              "kind": "text",
              "contains": "다 1"
            }
          ]
        }
      ],
      "rubricNote": "딕셔너리로 횟수를 세면서 처음 본 순서를 리스트에 따로 남겨 순서를 지키는 게 핵심. 조회와 누적을 구분했는지 평가."
    },
    {
      "id": "prob-4",
      "number": 4,
      "title": "공통 원소 찾기",
      "difficulty": "hard",
      "prompt": "두 모둠이 각자 좋아하는 수를 적어 냈습니다. 양쪽 모둠에 공통으로 들어 있는 수를 찾아 주세요.\n\n첫 번째 모둠의 수를 먼저 모두 받고, 그다음 두 번째 모둠의 수를 받습니다. 어떤 수가 두 번째 모둠에도 있는지는 in 으로 확인할 수 있습니다.\n\n[입력]\n첫째 줄: 첫 번째 모둠의 수 개수 N\n다음 N개의 줄: 정수 하나씩\n그다음 줄: 두 번째 모둠의 수 개수 M\n다음 M개의 줄: 정수 하나씩\n\n[출력]\n두 모둠에 모두 있는 수를, 첫 번째 모둠에 나온 순서대로 한 줄에 하나씩 출력합니다. 같은 수는 한 번만 출력합니다.",
      "conceptTags": [
        "8강 in",
        "7강 리스트",
        "5강 조건문"
      ],
      "examples": [
        {
          "stdin": [
            "4",
            "1",
            "2",
            "3",
            "4",
            "3",
            "3",
            "4",
            "5"
          ],
          "stdout": "3\n4"
        },
        {
          "stdin": [
            "3",
            "10",
            "20",
            "30",
            "2",
            "20",
            "40"
          ],
          "stdout": "20"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "n = int(input())\na = []\nfor i in range(n):\n    a.append(int(input()))\nm = int(input())\nb = []\nfor i in range(m):\n    b.append(int(input()))\nresult = []\nfor x in a:\n    if x in b and x not in result:\n        result.append(x)\nfor x in result:\n    print(x)\n",
      "publicTests": [
        {
          "label": "예시 1 (공통 3,4)",
          "stdin": [
            "4",
            "1",
            "2",
            "3",
            "4",
            "3",
            "3",
            "4",
            "5"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 3
            },
            {
              "kind": "number",
              "value": 4
            }
          ]
        },
        {
          "label": "예시 2 (공통 20)",
          "stdin": [
            "3",
            "10",
            "20",
            "30",
            "2",
            "20",
            "40"
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
          "label": "각 1개 공통 (경계)",
          "stdin": [
            "1",
            "5",
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
          "label": "여러 공통",
          "stdin": [
            "3",
            "1",
            "2",
            "3",
            "3",
            "2",
            "3",
            "4"
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
          "label": "중복 한 번만",
          "stdin": [
            "3",
            "7",
            "7",
            "8",
            "1",
            "7"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 7
            }
          ]
        },
        {
          "label": "A 순서 유지",
          "stdin": [
            "3",
            "9",
            "1",
            "5",
            "2",
            "5",
            "9"
          ],
          "expect": [
            {
              "kind": "number",
              "value": 9
            },
            {
              "kind": "number",
              "value": 5
            }
          ]
        },
        {
          "label": "음수",
          "stdin": [
            "3",
            "-1",
            "-2",
            "-3",
            "2",
            "-2",
            "-4"
          ],
          "expect": [
            {
              "kind": "number",
              "value": -2
            }
          ]
        }
      ],
      "rubricNote": "첫 모둠을 훑으며 두 번째 모둠에 있는지 in 으로 확인하고, 이미 담은 값은 다시 담지 않는 처리가 핵심. 순서 유지와 중복 제거를 함께 했는지 평가."
    },
    {
      "id": "prob-5",
      "number": 5,
      "title": "투표 최다 득표자",
      "difficulty": "hard",
      "prompt": "반장 선거를 개표합니다. 후보는 김파이, 이코드, 박몽 세 명입니다. 던져진 표를 모두 세어 가장 많은 표를 받은 후보의 이름을 출력해 주세요. 최다 득표자는 한 명으로 정해지며 동점은 없습니다.\n\n표에는 세 후보 중 한 명의 이름이 적혀 있습니다. 세 후보의 득표수를 딕셔너리에 세어 두고, 세 값을 견주어 가장 큰 후보를 고릅니다.\n\n[입력]\n첫째 줄: 표의 개수 N (1 이상)\n다음 N개의 줄: 후보 이름 하나씩 (김파이, 이코드, 박몽 중 하나)\n\n[출력]\n가장 많은 표를 받은 후보의 이름을 한 줄에 출력합니다.",
      "conceptTags": [
        "8강 딕셔너리",
        "5강 조건문",
        "6강 for/range"
      ],
      "examples": [
        {
          "stdin": [
            "5",
            "김파이",
            "이코드",
            "김파이",
            "박몽",
            "김파이"
          ],
          "stdout": "김파이"
        },
        {
          "stdin": [
            "3",
            "이코드",
            "이코드",
            "박몽"
          ],
          "stdout": "이코드"
        }
      ],
      "starterCode": "# 아래에 코드를 작성하세요\n",
      "solutionCode": "votes = {\"김파이\": 0, \"이코드\": 0, \"박몽\": 0}\nn = int(input())\nfor i in range(n):\n    name = input()\n    votes[name] = votes[name] + 1\na = votes[\"김파이\"]\nb = votes[\"이코드\"]\nc = votes[\"박몽\"]\nif a > b and a > c:\n    print(\"김파이\")\nelif b > a and b > c:\n    print(\"이코드\")\nelse:\n    print(\"박몽\")\n",
      "publicTests": [
        {
          "label": "예시 1 (김파이 3표)",
          "stdin": [
            "5",
            "김파이",
            "이코드",
            "김파이",
            "박몽",
            "김파이"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "김파이"
            }
          ]
        },
        {
          "label": "예시 2 (이코드 2표)",
          "stdin": [
            "3",
            "이코드",
            "이코드",
            "박몽"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "이코드"
            }
          ]
        }
      ],
      "hiddenTests": [
        {
          "label": "N=1 (경계)",
          "stdin": [
            "1",
            "박몽"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "박몽"
            }
          ]
        },
        {
          "label": "박몽 승",
          "stdin": [
            "3",
            "박몽",
            "박몽",
            "김파이"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "박몽"
            }
          ]
        },
        {
          "label": "이코드 승",
          "stdin": [
            "4",
            "이코드",
            "김파이",
            "이코드",
            "이코드"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "이코드"
            }
          ]
        },
        {
          "label": "박몽 과반",
          "stdin": [
            "5",
            "박몽",
            "박몽",
            "박몽",
            "김파이",
            "이코드"
          ],
          "expect": [
            {
              "kind": "text",
              "contains": "박몽"
            }
          ]
        }
      ],
      "rubricNote": "고정된 세 후보의 득표를 딕셔너리 조회로 세고 세 값을 견주어 최다를 고르는 게 핵심. 동점 없음 가정 아래 분기를 바르게 나눴는지 평가."
    }
  ]
};
