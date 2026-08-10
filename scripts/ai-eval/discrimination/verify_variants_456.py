# -*- coding: utf-8 -*-
"""
변별력 전수 검증용 변형 답안 (lesson-4/5/6) 정의 + 실측 채점 + JSON 생성.

- 매처는 scripts/ai-eval/grade_corpus.py 의 matches_expected / run_solution 을 그대로 복사.
- V2: 공개+히든 전 케이스 통과 (구조 결함만 있음)
- V3: 실행 오류 없이 돌지만 오개념 때문에 1개 이상 실패
- V4: 공개 예시에 맞춘 하드코딩 — 히든 과반 실패

실행: python verify_variants_456.py
"""
import json, re, io, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DRAFT = os.path.join(HERE, "..", "..", "problems-draft")
NUM_RE = re.compile(r"-?\d+(?:\.\d+)?")


# ---------------------------------------------------------------- matcher (복사본)
def matches_expected(stdout, expects):
    pos = 0
    for e in expects:
        if e["kind"] == "text":
            idx = stdout.find(e["contains"], pos)
            if idx < 0:
                return False
            pos = idx + len(e["contains"])
        else:
            m = NUM_RE.search(stdout, pos)
            if not m or abs(float(m.group(0)) - e["value"]) > 1e-9:
                return False
            pos = m.end()
    return True


def run_solution(code, stdin_lines):
    it = iter(stdin_lines)
    buf = io.StringIO()

    def fake_input(prompt=""):
        try:
            return next(it)
        except StopIteration:
            raise EOFError

    g = {"input": fake_input, "print": lambda *a, **k: print(*a, **{**k, "file": buf})}
    try:
        exec(code, g)
    except EOFError:
        pass
    except SyntaxError as ex:
        return buf.getvalue(), "SyntaxError: %s" % ex
    except Exception as ex:
        return buf.getvalue(), "%s: %s" % (type(ex).__name__, ex)
    return buf.getvalue(), None


# ---------------------------------------------------------------- 변형 정의
# (lesson, problemId, variant, desc, code)
VARIANTS = [
    # ============================== lesson-4 (조건문·반복문 없음) ==============================
    ("lesson-4", "prob-1", "V2",
     "정답이지만 input 문자열을 int 로 바꿨다가 다시 str, 또 int 로 되돌리는 불필요한 왕복 변환과 중복 변수",
     'a = input()\n'
     'b = input()\n'
     'a_num = int(a)\n'
     'b_num = int(b)\n'
     'total = a_num + b_num\n'
     'total_str = str(total)\n'
     'print(int(total_str))\n'),
    ("lesson-4", "prob-1", "V3",
     "int() 형변환을 빠뜨려 문자열끼리 이어 붙임 (+ 가 덧셈이 아니라 연결로 동작)",
     'a = input()\n'
     'b = input()\n'
     'print(a + b)\n'),
    ("lesson-4", "prob-1", "V4",
     "입력을 읽기만 하고 첫 번째 공개 예시 답 7 을 고정 출력",
     'a = int(input())\n'
     'b = int(input())\n'
     'print(7)\n'),

    ("lesson-4", "prob-2", "V2",
     "다섯 연산을 변수에 담아 놓고 하나도 쓰지 않은 채 print 안에서 전부 다시 계산",
     'a = int(input())\n'
     'b = int(input())\n'
     'plus = a + b\n'
     'minus = a - b\n'
     'times = a * b\n'
     'share = a // b\n'
     'rest = a % b\n'
     'print(a + b)\n'
     'print(a - b)\n'
     'print(a * b)\n'
     'print(a // b)\n'
     'print(a % b)\n'),
    ("lesson-4", "prob-2", "V3",
     "몫 // 자리에 나눗셈 / 를 써서 나눠떨어지지 않을 때 소수가 그대로 출력됨",
     'a = int(input())\n'
     'b = int(input())\n'
     'print(a + b)\n'
     'print(a - b)\n'
     'print(a * b)\n'
     'print(a / b)\n'
     'print(a % b)\n'),
    ("lesson-4", "prob-2", "V4",
     "입력을 읽기만 하고 첫 번째 공개 예시(7,3)의 결과 다섯 줄을 고정 출력",
     'a = int(input())\n'
     'b = int(input())\n'
     'print(10)\n'
     'print(4)\n'
     'print(21)\n'
     'print(2)\n'
     'print(1)\n'),

    ("lesson-4", "prob-3", "V2",
     "나머지를 % 대신 뺄셈으로 우회하고 같은 값을 total/rest/minute 세 변수에 거듭 복사",
     'm = int(input())\n'
     'total = m\n'
     'hour = total // 60\n'
     'rest = total - hour * 60\n'
     'minute = rest\n'
     'print(hour)\n'
     'print(minute)\n'),
    ("lesson-4", "prob-3", "V3",
     "몫 // 와 나머지 % 의 역할을 뒤바꿔 시간과 분을 반대로 출력",
     'm = int(input())\n'
     'print(m % 60)\n'
     'print(m // 60)\n'),
    ("lesson-4", "prob-3", "V4",
     "입력을 읽기만 하고 첫 번째 공개 예시 답 2 / 30 을 고정 출력",
     'm = int(input())\n'
     'print(2)\n'
     'print(30)\n'),

    ("lesson-4", "prob-4", "V2",
     "남은 금액을 rest1, rest2 로 두 번 복사하고 500원 개수는 변수에 담아 놓고 print 에서 다시 계산",
     'money = int(input())\n'
     'c500 = money // 500\n'
     'rest1 = money - c500 * 500\n'
     'rest2 = rest1\n'
     'c100 = rest2 // 100\n'
     'print(money // 500)\n'
     'print(c100)\n'),
    ("lesson-4", "prob-4", "V3",
     "500원을 쓰고 남은 금액을 넘기지 않고 전체 금액을 그대로 100 으로 나눠 100원 개수를 셈",
     'money = int(input())\n'
     'print(money // 500)\n'
     'print(money // 100)\n'),
    ("lesson-4", "prob-4", "V4",
     "입력을 읽기만 하고 첫 번째 공개 예시 답 2 / 3 을 고정 출력",
     'money = int(input())\n'
     'print(2)\n'
     'print(3)\n'),

    ("lesson-4", "prob-5", "V2",
     "평균을 average, answer 두 변수에 담아 두고 정작 print 에서는 합을 처음부터 다시 계산",
     'a = int(input())\n'
     'b = int(input())\n'
     'c = int(input())\n'
     'total = a + b + c\n'
     'count = 3\n'
     'average = total / count\n'
     'answer = average\n'
     'print((a + b + c) / count)\n'),
    ("lesson-4", "prob-5", "V3",
     "평균에 / 대신 몫 // 를 써서 소수점이 잘림",
     'a = int(input())\n'
     'b = int(input())\n'
     'c = int(input())\n'
     'print((a + b + c) // 3)\n'),
    ("lesson-4", "prob-5", "V4",
     "입력을 읽기만 하고 첫 번째 공개 예시 답 80.0 을 고정 출력",
     'a = int(input())\n'
     'b = int(input())\n'
     'c = int(input())\n'
     'print(80.0)\n'),

    ("lesson-4", "prob-6", "V2",
     "자리 숫자를 % 10 대신 뺄셈으로 걷어내고 마지막 A×B 도 앞서 구한 자리별 결과를 재조합해 우회 계산",
     'a = int(input())\n'
     'b = int(input())\n'
     'ones = a % 10\n'
     'tens = (a % 100 - ones) // 10\n'
     'hundreds = (a - tens * 10 - ones) // 100\n'
     'print(ones * b)\n'
     'print(tens * b)\n'
     'print(hundreds * b)\n'
     'print(ones * b + tens * b * 10 + hundreds * b * 100)\n'),
    ("lesson-4", "prob-6", "V3",
     "출력 순서를 문제와 반대로 읽어 백의 자리부터 일의 자리 순으로 출력",
     'a = int(input())\n'
     'b = int(input())\n'
     'hundreds = a // 100\n'
     'tens = (a // 10) % 10\n'
     'ones = a % 10\n'
     'print(hundreds * b)\n'
     'print(tens * b)\n'
     'print(ones * b)\n'
     'print(a * b)\n'),
    ("lesson-4", "prob-6", "V4",
     "입력을 읽기만 하고 첫 번째 공개 예시(123×456)의 네 줄을 고정 출력",
     'a = int(input())\n'
     'b = int(input())\n'
     'print(1368)\n'
     'print(912)\n'
     'print(456)\n'
     'print(56088)\n'),

    # ============================== lesson-5 (조건문까지) ==============================
    ("lesson-5", "prob-1", "V2",
     "서로 배타적인 세 갈래를 elif 없이 if 세 번으로 나열하고 결과를 answer 변수에 담았다가 마지막에 출력",
     'a = int(input())\n'
     'b = int(input())\n'
     'answer = ""\n'
     'if a > b:\n'
     '    answer = ">"\n'
     'if a < b:\n'
     '    answer = "<"\n'
     'if a == b:\n'
     '    answer = "=="\n'
     'print(answer)\n'),
    ("lesson-5", "prob-1", "V3",
     "두 수가 같은 경우를 빼먹고 크다/작다 두 갈래로만 나눔",
     'a = int(input())\n'
     'b = int(input())\n'
     'if a > b:\n'
     '    print(">")\n'
     'else:\n'
     '    print("<")\n'),
    ("lesson-5", "prob-1", "V4",
     "공개 예시 입력값 3 인지만 확인해 < 를 출력하고 나머지는 전부 > 로 처리",
     'a = int(input())\n'
     'b = int(input())\n'
     'if a == 3:\n'
     '    print("<")\n'
     'else:\n'
     '    print(">")\n'),

    ("lesson-5", "prob-2", "V2",
     "else 안에 다시 if/else 를 넣어 두 갈래 모두 같은 홀수 결과를 출력하는 과잉 중첩",
     'n = int(input())\n'
     'rest = n % 2\n'
     'if rest == 0:\n'
     '    result = "짝수"\n'
     'else:\n'
     '    if rest == 1:\n'
     '        result = "홀수"\n'
     '    else:\n'
     '        result = "홀수"\n'
     'print(result)\n'),
    ("lesson-5", "prob-2", "V3",
     "짝수 조건에 n > 0 을 덧붙여 0 과 음수 짝수를 홀수로 잘못 판정",
     'n = int(input())\n'
     'if n > 0 and n % 2 == 0:\n'
     '    print("짝수")\n'
     'else:\n'
     '    print("홀수")\n'),
    ("lesson-5", "prob-2", "V4",
     "공개 예시 입력값 8 인지만 확인해 짝수를 출력하고 나머지는 전부 홀수로 처리",
     'n = int(input())\n'
     'if n == 8:\n'
     '    print("짝수")\n'
     'else:\n'
     '    print("홀수")\n'),

    ("lesson-5", "prob-3", "V2",
     "elif 사다리 대신 if 다섯 개를 나열하고 각 줄마다 상한 조건을 중복으로 덧붙임",
     'score = int(input())\n'
     'if score >= 90:\n'
     '    print("A")\n'
     'if score >= 80 and score < 90:\n'
     '    print("B")\n'
     'if score >= 70 and score < 80:\n'
     '    print("C")\n'
     'if score >= 60 and score < 70:\n'
     '    print("D")\n'
     'if score < 60:\n'
     '    print("F")\n'),
    ("lesson-5", "prob-3", "V3",
     "이상(>=)을 초과(>)로 잘못 써서 90, 80, 70, 60 경계 점수가 한 단계씩 밀림",
     'score = int(input())\n'
     'if score > 90:\n'
     '    print("A")\n'
     'elif score > 80:\n'
     '    print("B")\n'
     'elif score > 70:\n'
     '    print("C")\n'
     'elif score > 60:\n'
     '    print("D")\n'
     'else:\n'
     '    print("F")\n'),
    ("lesson-5", "prob-3", "V4",
     "공개 예시 입력값 85 인지만 확인해 B 를 출력하고 나머지는 전부 F 로 처리",
     'score = int(input())\n'
     'if score == 85:\n'
     '    print("B")\n'
     'else:\n'
     '    print("F")\n'),

    ("lesson-5", "prob-4", "V2",
     "if 를 두 겹으로 중첩해 네 갈래를 만들고 print(c) 를 두 번 중복 작성",
     'a = int(input())\n'
     'b = int(input())\n'
     'c = int(input())\n'
     'if a >= b:\n'
     '    if a >= c:\n'
     '        print(a)\n'
     '    else:\n'
     '        print(c)\n'
     'else:\n'
     '    if b >= c:\n'
     '        print(b)\n'
     '    else:\n'
     '        print(c)\n'),
    ("lesson-5", "prob-4", "V3",
     "이상(>=) 대신 초과(>)만 써서 앞의 두 수가 동점으로 최대일 때 마지막 수를 출력",
     'a = int(input())\n'
     'b = int(input())\n'
     'c = int(input())\n'
     'if a > b and a > c:\n'
     '    print(a)\n'
     'elif b > a and b > c:\n'
     '    print(b)\n'
     'else:\n'
     '    print(c)\n'),
    ("lesson-5", "prob-4", "V4",
     "공개 예시 입력값 3 인지만 확인해 7 을 출력하고 나머지는 전부 10 으로 처리",
     'a = int(input())\n'
     'b = int(input())\n'
     'c = int(input())\n'
     'if a == 3:\n'
     '    print(7)\n'
     'else:\n'
     '    print(10)\n'),

    ("lesson-5", "prob-5", "V2",
     "leap 플래그를 if 세 번으로 덮어쓰며 순서에 의존하게 만들고 출력도 else 없이 if 두 번으로 나눔",
     'year = int(input())\n'
     'leap = 0\n'
     'if year % 4 == 0:\n'
     '    leap = 1\n'
     'if year % 100 == 0:\n'
     '    leap = 0\n'
     'if year % 400 == 0:\n'
     '    leap = 1\n'
     'if leap == 1:\n'
     '    print("윤년")\n'
     'if leap == 0:\n'
     '    print("평년")\n'),
    ("lesson-5", "prob-5", "V3",
     "400 으로 나누어떨어지면 다시 윤년이라는 예외 규칙을 빠뜨림",
     'year = int(input())\n'
     'if year % 4 == 0 and year % 100 != 0:\n'
     '    print("윤년")\n'
     'else:\n'
     '    print("평년")\n'),
    ("lesson-5", "prob-5", "V4",
     "공개 예시 입력값 2020 인지만 확인해 윤년을 출력하고 나머지는 전부 평년으로 처리",
     'year = int(input())\n'
     'if year == 2020:\n'
     '    print("윤년")\n'
     'else:\n'
     '    print("평년")\n'),

    ("lesson-5", "prob-6", "V2",
     "바깥 if 에서 이미 가른 x 의 부호를 안쪽에서 또 검사하는 중복 조건 + 중첩 구조",
     'x = int(input())\n'
     'y = int(input())\n'
     'if x > 0:\n'
     '    if y > 0:\n'
     '        print(1)\n'
     '    elif y < 0:\n'
     '        print(4)\n'
     'else:\n'
     '    if x < 0 and y > 0:\n'
     '        print(2)\n'
     '    elif x < 0 and y < 0:\n'
     '        print(3)\n'),
    ("lesson-5", "prob-6", "V3",
     "사분면 번호를 시계 방향으로 세어 2사분면과 4사분면을 뒤바꿔 출력",
     'x = int(input())\n'
     'y = int(input())\n'
     'if x > 0 and y > 0:\n'
     '    print(1)\n'
     'elif x > 0 and y < 0:\n'
     '    print(2)\n'
     'elif x < 0 and y < 0:\n'
     '    print(3)\n'
     'else:\n'
     '    print(4)\n'),
    ("lesson-5", "prob-6", "V4",
     "공개 예시 입력값 x 가 3 인지만 확인해 1 을 출력하고 나머지는 전부 2 로 처리",
     'x = int(input())\n'
     'y = int(input())\n'
     'if x == 3:\n'
     '    print(1)\n'
     'else:\n'
     '    print(2)\n'),

    # ============================== lesson-6 (반복문까지) ==============================
    ("lesson-6", "prob-1", "V2",
     "for 가 주는 반복 변수를 쓰지 않고 i 를 손으로 증가시키며 temp 임시 변수까지 거쳐 누적",
     'n = int(input())\n'
     'total = 0\n'
     'i = 1\n'
     'for x in range(1, n + 1):\n'
     '    temp = total\n'
     '    total = temp + i\n'
     '    i = i + 1\n'
     'print(total)\n'),
    ("lesson-6", "prob-1", "V3",
     "누적 변수 초기화를 반복문 안에 두어 매번 0 으로 되돌아가 마지막 값만 남음",
     'n = int(input())\n'
     'for i in range(1, n + 1):\n'
     '    total = 0\n'
     '    total = total + i\n'
     'print(total)\n'),
    ("lesson-6", "prob-1", "V4",
     "입력을 읽기만 하고 첫 번째 공개 예시 답 55 를 total 에 넣어 고정 출력",
     'n = int(input())\n'
     'total = 55\n'
     'print(total)\n'),

    ("lesson-6", "prob-2", "V2",
     "range 가 주는 k 를 버리고 i 를 손으로 증가시키며 출력도 str() 로 일일이 이어 붙여 만듦",
     'n = int(input())\n'
     'i = 1\n'
     'for k in range(9):\n'
     '    result = n * i\n'
     '    line = str(n) + " x " + str(i) + " = " + str(result)\n'
     '    print(line)\n'
     '    i = i + 1\n'),
    ("lesson-6", "prob-2", "V3",
     "반복 횟수를 9 가 아니라 입력 N 으로 착각해 range(1, n + 1) 로 돌림",
     'n = int(input())\n'
     'for i in range(1, n + 1):\n'
     '    print(n, "x", i, "=", n * i)\n'),
    ("lesson-6", "prob-2", "V4",
     "공개 예시 입력값 2 인지만 확인해 2단을 출력하고 나머지는 전부 5단을 출력",
     'n = int(input())\n'
     'if n == 2:\n'
     '    for i in range(1, 10):\n'
     '        print(2, "x", i, "=", 2 * i)\n'
     'else:\n'
     '    for i in range(1, 10):\n'
     '        print(5, "x", i, "=", 5 * i)\n'),

    ("lesson-6", "prob-3", "V2",
     "누적할 때 temp 임시 변수를 한 번 거치고, 끝까지 쓰이지 않는 count 카운터를 함께 굴림",
     'n = int(input())\n'
     'total = 0\n'
     'count = 0\n'
     'for i in range(n):\n'
     '    x = int(input())\n'
     '    temp = total + x\n'
     '    total = temp\n'
     '    count = count + 1\n'
     'print(total)\n'),
    ("lesson-6", "prob-3", "V3",
     "반복 범위를 range(n) 대신 range(1, n) 으로 잡아 마지막 수를 한 개 덜 읽음",
     'n = int(input())\n'
     'total = 0\n'
     'for i in range(1, n):\n'
     '    x = int(input())\n'
     '    total = total + x\n'
     'print(total)\n'),
    ("lesson-6", "prob-3", "V4",
     "개수 N 이 공개 예시의 3 인지만 확인해 60 을 출력하고 나머지는 전부 20 으로 처리",
     'n = int(input())\n'
     'if n == 3:\n'
     '    print(60)\n'
     'else:\n'
     '    print(20)\n'),

    ("lesson-6", "prob-4", "V2",
     "약수를 찾은 뒤 항상 참인 answer > 0 조건을 한 겹 더 씌운 불필요한 중첩과 임시 변수",
     'n = int(input())\n'
     'for i in range(1, n + 1):\n'
     '    rest = n % i\n'
     '    if rest == 0:\n'
     '        answer = i\n'
     '        if answer > 0:\n'
     '            print(answer)\n'),
    ("lesson-6", "prob-4", "V3",
     "나머지 연산의 순서를 뒤집어 n % i 대신 i % n 으로 판정",
     'n = int(input())\n'
     'for i in range(1, n + 1):\n'
     '    if i % n == 0:\n'
     '        print(i)\n'),
    ("lesson-6", "prob-4", "V4",
     "공개 예시 입력값 6 인지만 확인해 1/2/3/6 을 출력하고 나머지는 전부 1/7 을 출력",
     'n = int(input())\n'
     'if n == 6:\n'
     '    print(1)\n'
     '    print(2)\n'
     '    print(3)\n'
     '    print(6)\n'
     'else:\n'
     '    print(1)\n'
     '    print(7)\n'),

    ("lesson-6", "prob-5", "V2",
     "안쪽 반복에서 별 한 개를 star 변수에 담아 붙이고, 끝까지 쓰이지 않는 count 카운터를 함께 굴림",
     'n = int(input())\n'
     'for i in range(1, n + 1):\n'
     '    line = ""\n'
     '    count = 0\n'
     '    for j in range(1, i + 1):\n'
     '        star = "*"\n'
     '        line = line + star\n'
     '        count = count + 1\n'
     '    print(line)\n'),
    ("lesson-6", "prob-5", "V3",
     "안쪽 반복 횟수를 줄 번호 i 가 아니라 N 으로 고정해 모든 줄에 별 N 개를 찍음",
     'n = int(input())\n'
     'for i in range(1, n + 1):\n'
     '    line = ""\n'
     '    for j in range(n):\n'
     '        line = line + "*"\n'
     '    print(line)\n'),
    ("lesson-6", "prob-5", "V4",
     "공개 예시 입력값 3 인지만 확인해 세 줄을 출력하고 나머지는 전부 별 한 줄만 출력",
     'n = int(input())\n'
     'if n == 3:\n'
     '    print("*")\n'
     '    print("**")\n'
     '    print("***")\n'
     'else:\n'
     '    print("*")\n'),

    ("lesson-6", "prob-6", "V2",
     "a, b 를 x, y 로 복사한 뒤 temp1/temp2 두 임시 변수를 거쳐 값을 넘기는 우회 구조",
     'a = int(input())\n'
     'b = int(input())\n'
     'x = a\n'
     'y = b\n'
     'while y != 0:\n'
     '    temp1 = y\n'
     '    temp2 = x % y\n'
     '    x = temp1\n'
     '    y = temp2\n'
     'print(x)\n'),
    ("lesson-6", "prob-6", "V3",
     "공약수를 1부터 훑되 범위를 range(1, a) 로 잡아 a 자신을 후보에서 빠뜨림",
     'a = int(input())\n'
     'b = int(input())\n'
     'answer = 1\n'
     'for i in range(1, a):\n'
     '    if a % i == 0 and b % i == 0:\n'
     '        answer = i\n'
     'print(answer)\n'),
    ("lesson-6", "prob-6", "V4",
     "공개 예시 입력값 12 인지만 확인해 6 을 출력하고 나머지는 전부 4 로 처리",
     'a = int(input())\n'
     'b = int(input())\n'
     'if a == 12:\n'
     '    print(6)\n'
     'else:\n'
     '    print(4)\n'),
]


# ---------------------------------------------------------------- 실행
def load_problems():
    out = {}
    for lesson in ("lesson-4", "lesson-5", "lesson-6"):
        with io.open(os.path.join(DRAFT, lesson + ".json"), encoding="utf-8") as f:
            d = json.load(f)
        for p in d["problems"]:
            out[(d["lessonId"], p["id"])] = p
    return out


def main():
    problems = load_problems()
    by_lesson = {"lesson-4": [], "lesson-5": [], "lesson-6": []}
    failures = []

    for lesson, pid, variant, desc, code in VARIANTS:
        p = problems[(lesson, pid)]
        pub, hid = p["publicTests"], p["hiddenTests"]
        tests = pub + hid
        n_public = len(pub)

        passed = 0
        pub_passed = 0
        hid_passed = 0
        err = None
        for i, t in enumerate(tests):
            stdout, e = run_solution(code, t["stdin"])
            if e and err is None:
                err = e
            ok = e is None and matches_expected(stdout, t["expect"])
            if ok:
                passed += 1
                if i < n_public:
                    pub_passed += 1
                else:
                    hid_passed += 1

        total = len(tests)
        n_hidden = len(hid)
        hid_failed = n_hidden - hid_passed

        # 조건 판정
        if variant == "V2":
            ok_cond = (passed == total) and err is None
            cond = "all-pass"
        elif variant == "V3":
            ok_cond = (passed < total) and err is None
            cond = "some-fail & no-error"
        else:
            ok_cond = (hid_failed * 2 > n_hidden) and err is None
            cond = "hidden-majority-fail"

        # 길이 제약 (입문자가 쓸 법한 3~15줄)
        n_lines = len([ln for ln in code.strip().split("\n")])
        len_ok = 3 <= n_lines <= 15

        status = "OK " if (ok_cond and len_ok) else "BAD"
        print("%s %s/%s %s  cases %d/%d (public %d/%d, hidden %d/%d) %dL [%s]%s"
              % (status, lesson, pid, variant, passed, total,
                 pub_passed, n_public, hid_passed, n_hidden, n_lines, cond,
                 ("  ERR=" + err.split(":")[0]) if err else ""))
        if not ok_cond:
            failures.append("%s/%s %s (조건)" % (lesson, pid, variant))
        if not len_ok:
            failures.append("%s/%s %s (길이 %d줄)" % (lesson, pid, variant, n_lines))

        by_lesson[lesson].append({
            "problemId": pid,
            "variant": variant,
            "desc": desc,
            "code": code,
            "measuredCasesPassed": passed,
            "measuredCasesTotal": total,
        })

    for lesson, variants in by_lesson.items():
        path = os.path.join(HERE, "variants-%s.json" % lesson)
        with io.open(path, "w", encoding="utf-8") as f:
            json.dump({"lesson": lesson, "variants": variants}, f,
                      ensure_ascii=False, indent=2)
            f.write(u"\n")
        print("saved %s (%d variants)" % (os.path.basename(path), len(variants)))

    print("")
    if failures:
        print("CONDITION FAILURES (%d): %s" % (len(failures), ", ".join(failures)))
        sys.exit(1)
    print("ALL %d VARIANTS MEET THEIR CONDITION." % len(VARIANTS))


if __name__ == "__main__":
    main()
