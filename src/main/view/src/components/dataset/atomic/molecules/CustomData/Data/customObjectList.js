export const dataSource = [
  {
    key: '열',
    collection: [
      {
      }
    ]
  },
  {
    key: '상수',
    collection: [
      {
        key: 'True',
        explain: '부울 True 값을 나타냅니다.'
      },
      {
        key: 'False',
        explain: '부울 False 값을 나타냅니다.'
      },
      {
        key: '?',
        explain: '한 개체를 참조 하지 않는 null 참조를 나타냅니다.'
      }
    ]
  },
  {
    key: '연산자',
    collection: [
      {
        key: '+',
        explain: '더하기'
      },
      {
        key: '-',
        explain: '빼기'
      },
      {
        key: '*',
        explain: '곱하기'
      },
      {
        key: '/',
        explain: '나누기'
      },
      {
        key: '%',
        explain: '나머지'
      },
      {
        key: '^',
        explain: 'Power'
      },
      {
        key: '!',
        explain: 'Factorial'
      },
      {
        key: '&',
        explain: 'Bitwise and'
      },
      {
        key: '|',
        explain: 'Bitwise or'
      },
      {
        key: '^|',
        explain: 'Bitwise xor'
      },
      {
        key: '<<',
        explain: 'Left shift'
      },
      {
        key: '>>',
        explain: 'Right arithmetic shift'
      },
      {
        key: '>>>',
        explain: 'Right logical shift'
      },
      {
        key: 'and',
        explain: 'Logical and'
      },
      {
        key: 'or',
        explain: 'Logical or'
      },
      {
        key: 'xor',
        explain: 'Logical xor'
      },
      {
        key: '=',
        explain: 'Assignment'
      },
      {
        key: '?:',
        explain: '빼기'
      },
      {
        key: ':',
        explain: 'Conditional expression'
      },
      {
        key: 'to',
        explain: 'Unit conversion'
      },
      {
        key: '==',
        explain: 'Equal'
      },
      {
        key: '!=',
        explain: 'Unequal'
      },
      {
        key: '<',
        explain: 'Smaller'
      },
      {
        key: '>',
        explain: 'Larger'
      },
      {
        key: '<=',
        explain: 'Smallereq'
      },
      {
        key: '>=',
        explain: 'Largereq'
      }
    ]
  },
  {
    key: '집계함수',
    collection: [
      {
        key: 'Avg(value)',
        explain: '컬렉션에 있는 값의 평균을 계산 합니다.'
      },
      {
        key: 'Count()',
        explain: '컬렉션의 개체 수를 반환 합니다.'
      },
      {
        key: 'Max(Value)',
        explain: '컬렉션의 최대 표현 값을 반환 합니다.'
      },
      {
        key: 'Median(Value)',
        explain: '컬렉션에 있는 값 들의 중간 값을 반환합니다.'
      },
      {
        key: 'Max(Value)',
        explain: '컬렉션의 최대 표현 값을 반환 합니다.'
      },
      {
        key: 'Min(Value)',
        explain: '컬렉션에서 최소 식 값을 반환 합니다.'
      },
      {
        key: 'Mode(Value)',
        explain: '값의 모드입니다. 모드는 다른 것보다 더 자주 반복되는 값입니다.'
      },
      {
        key: 'StdDev(Value)',
        explain: '모집단의 표준 편차에 대한 추정치를 반환합니다. 여기서 샘플은 전체 모집단의 하위 집합입니다.'
      },
      {
        key: 'Sum(Value)',
        explain: '컬렉션에서 모든 식 값의 합계를 반환 합니다.'
      },
      {
        key: 'Var(Value)',
        explain: '모집단의 분산에 대한 추정치를 반환하며, 여기서 샘플은 전체 모집단의 하위 집합이다.'
      }
    ]
  },
  {
    key: '논리함수',
    collection: [
      {
        key: 'Iif(식, 참, FalsePart)',
        explain: '부울 식의 평가 따라 참 또는 FalsePart를 반환 합니다.'
      },
      {
        key: 'IsNull(Value)',
        explain: '지정된 된 값이 NULL 경우 True를 반환 합니다.'
      },
      {
        key: 'IsNullOrEmpty(String)',
        explain: '지정 된 String 개체는 NULL 또는 빈 문자열'+
         '하는 경우 True를 반환 합니다. 그렇지 않은 경우 False가 반환 됩니다.'
      },
      {
        key: 'ToBoolean(Value)',
        explain: 'Value를 등가의 부울 값으로 변환합니다.'
      }
    ]
  },
  {
    key: '수학함수',
    collection: [
      {
        key: 'Abs(Value)',
        explain: '지정된 된 숫자 식의 절대, 양수 값을 반환 합니다.'
      },
      {
        key: 'Acos(Value)',
        explain: '(코사인은 주어진된 float 식 라디안에서 각도) 숫자의 아크코사인 값을 반환 합니다.'
      },
      {
        key: 'Asin(Value)',
        explain: '(각도, 라디안, 사인 주어진된 float 식) 숫자의 아크사인 값을 반환 합니다.'
      },
      {
        key: 'Atn(Value1, [Value2])',
        explain: '각도 탄젠트는 라디안에서 2 개의 지정 된 수의 몫을 반환 합니다.'
      },
      {
        key: 'BigMul(Value1, Value2)',
        explain: 'Int64 반환 합니다 두 개의 완전 한 제품을 포함 하는 32 비트 숫자를 지정 합니다.'
      },
      {
        key: 'Ceiling(Value)',
        explain: '지정된 된 숫자 식 보다 크거나 같은 최소 정수를 반환 합니다.'
      },
      {
        key: 'Cos(Value)',
        explain: '라디안에서 정의 된 각도의 코사인을 반환 합니다.'
      },
      {
        key: 'Cosh(Value)',
        explain: '라디안에서 정의 된 각도의 하이퍼볼릭 코사인 값을 반환 합니다.'
      },
      {
        key: 'Exp(Value)',
        explain: '지정된 된 float 식의 지 수 값을 반환 합니다.'
      },
      {
        key: 'Floor(Value)',
        explain: '지정된 된 숫자 식 보다 작거나 같은 가장 큰 정수를 반환 합니다.'
      },
      {
        key: 'Log(Value, [Base])',
        explain: '지정된 된 밑에서 지정된 된 숫자의 로그를 반환 합니다.'
      },
      {
        key: 'Log10(Value)',
        explain: '지정 된 숫자의 반환 기본 10 로그.'
      },
      {
        key: 'Power(Value, Power)',
        explain: '지정 된 수를 지정 된 거듭제곱을 반환 합니다.'
      },
      {
        key: 'Rnd()',
        explain: '하지만 0 보다 크거나 1 보다 작은 난수를 반환 합니다.'
      },
      {
        key: 'Round(Value, [Presicison])',
        explain: '가장 가까운 정수 또는 소수 자릿수가 지정된 된 지정된 된 값을 반올림합니다.'
      },
      {
        key: 'Sign(Value)',
        explain: '양수 (+1), 영 (0), 또는 지정된 된 식의 음수 (-1) 기호를 반환 합니다.'
      },
      {
        key: 'Sin(Value)',
        explain: '라디안에서 정의 된 각도의 사인을 반환 합니다.'
      },
      {
        key: 'Sinh(Value)',
        explain: '라디안에서 정의 된 각도의 하이퍼볼릭 사인을 반환 합니다.'
      },
      {
        key: 'Sqr(Value)',
        explain: '지정 된 숫자의 제곱근을 반환 합니다.'
      },
      {
        key: 'Tan(Value)',
        explain: '라디안에서 정의 된 각도의 탄젠트를 반환 합니다.'
      },
      {
        key: 'Tanh(Value)',
        explain: '라디안에서 정의 된 각도의 하이퍼볼릭 탄젠트를 반환 합니다.'
      }
    ]
  },
  {
    key: '문자열함수',
    collection: [
      {
        key: 'Ascii(String)',
        explain: '문자 식에서 가장 왼쪽 문자의 ASCII 코드 값을 반환 합니다.'
      },
      {
        key: 'Char(Number)',
        explain: '문자는 integerASCIICode로 변환 합니다.'
      },
      {
        key: 'CharIndex (String1, String2, [StartLocation])',
        explain: 'String1 내에서 String2, StartLocation' +
        '문자 위치에서 시작 하는 문자열의 끝에 시작 위치를 반환 합니다.'
      },
      {
        key: 'Concat(문자열 1,..., StringN)',
        explain: '어떤 추가 문자열 사용 하 여 현재 문자열의 연결을 포함 하는 문자열 값을 반환 합니다.'
      },
      {
        key: 'Contains(문자열, 문자열)',
        explain: '(문자열, 문자열)을 포함 부분 문자열 문자열;'+
        '내에서 발생 하는 경우 True를 반환 합니다. 그렇지 않은 경우 False가 반환 됩니다.'
      },
      {
        key: 'EndsWith(String, EndString)',
        explain: '문자열의 끝 EndString; 일치 하는 경우 True를 반환 합니다.'+
        '그렇지 않은 경우 False가 반환 됩니다.'
      },
      {
        key: 'Insert(문자열 1, StartPosition, 문자열 2)',
        explain: 'StartPositon로 지정 된 위치에서 문자열 1 문자열 2 삽입'
      },
      {
        key: 'Len(Value)',
        explain: '문자열 또는 변수를 저장 하는 데 필요한 바이트의'+
        '명목상 수 문자 수 중 하나를 포함 하는 정수를 반환 합니다.'
      },
      {
        key: 'Lower(String)',
        explain: '소문자 문자열을 반환 합니다.'
      },
      {
        key: 'PadLeft(문자열, 길이, [Char])',
        explain: '정의 된 문자열을 지정한 길이까지 지정 된 Char와 그것의 왼쪽 여백에 문자 왼쪽에 정렬 합니다.'
      },
      {
        key: 'PadRight(문자열, 길이, [Char])',
        explain: '지정한 길이 만큼까지 지정 된 Char와 그것의 왼쪽 패딩 정의 문자열의 문자 오른쪽에 정렬 합니다.'
      },
      {
        key: 'Remove(String, StartPosition, [Length])',
        explain: '지정된 StartPosition에서 시작하여 지정된 문자열에서 지정된 길이의 문자를 삭제합니다.'
      },
      {
        key: 'Replace(문자열, SubString2, String3)',
        explain: '문자열 1에서 SubString2 String3로 대체 되었습니다의 복사본을 반환 합니다.'
      },
      {
        key: 'Reverse(String)',
        explain: '문자열 내에서 요소 순서를 반대로 바꿉니다.'
      },
      {
        key: 'StartsWith(String, StartString)',
        explain: '문자열의 시작 부분과 일치 StartString;'+
        '경우 True를 반환 합니다. 그렇지 않은 경우 False가 반환 됩니다.'
      },
      {
        key: 'Substring(문자열, StartPosition, 길이)',
        explain: '문자열에서 부분 문자열을 검색합니다.'+
        '부분 문자열 StartPosition에서 시작 하 고 지정 된 길이 있다.'
      },
      {
        key: 'ToStr(Value)',
        explain: '개체의 문자열 표현을 반환 합니다.'
      },
      {
        key: 'Trim(String)',
        explain: '문자열에서 모든 선행 및 후행 공백 문자를 제거 합니다.'
      },
      {
        key: 'Upper(String)',
        explain: '대문자 문자열을 반환 합니다.'
      },
      {
        key: 'StringAdd(String1, String2, String3...)',
        explain: '문자열1 뒤에 문자열2, 문자열2 뒤에 문자열3 뒤에...를 더해서 반환됩니다.'
      }
    ]
  }
];

