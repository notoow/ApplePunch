# ApplePunch · 펀치볼 사과나라

Graza의 화면 구성과 스크롤 흐름을 참고한 농장 사과 판매 웹사이트입니다.
텍스트 워드마크와 실제 포장 사진, Pretendard를 사용합니다.

배포 주소: https://notoow.github.io/ApplePunch/

main 브랜치에 push하면 GitHub Actions가 사이트 파일만 패키징해 GitHub Pages로 배포합니다.

## 실행

프로젝트 폴더에서 다음 명령을 실행합니다.

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

브라우저에서 http://127.0.0.1:5173/ 을 엽니다. 별도 설치나 빌드는 필요하지 않습니다.

## 화면과 기능

- `index.html`: 전체 화면 사진, 혼합 구성 소개, 상품 3종, 실제 포장, 주문 FAQ, 푸터.
- `product.html?size=large|medium|small`: 크기·품종·수량 선택, 합계 계산, 주문 목록에 담기.
- 주문 목록: 브라우저에 저장되며 수량 변경·삭제·구성 복사를 지원합니다.
- 주문 방식: 전화 문의. 온라인 결제나 서버 주문 전송은 연결되어 있지 않습니다.
- 모바일: 메뉴 펼치기, 상품 가로 스크롤, 반응형 상품 상세와 주문 목록.
- 품종명 안내: PC 호버·키보드 포커스, 모바일 탭으로 부사·엔부·시나노골드·이지플 특징을 확인합니다. 문구 근거는 `docs/varieties.md`에 정리했습니다.
- 대표 사진과 당도·산미 점 표시를 함께 제공합니다. 사진 출처와 편집상 맛 가이드의 기준은 `docs/cultivar-photos.md`에 정리했습니다.
- 상품 상세: 고정되는 큰 사진 갤러리, 사진으로 고르는 품종 옵션, 상품 안내·품종 가이드·주문 배송 탭, 모바일 주문 버튼을 제공합니다.
- Graza의 비율을 참고한 얇은 고정 메뉴, 전체 높이 메인 화면, 스크롤에 따라 움직이는 큰 문구 구간을 적용했습니다. 움직임 줄이기 설정에서는 효과를 끕니다.

표시 가격은 제공된 전단의 5kg 가격(대과 65,000원, 중과 55,000원, 소과 40,000원)을 사용합니다.
감홍은 상자당 10,000원 추가로 계산합니다. 혼합 구성의 실제 준비 수량과 최종 주문은 전화로 확인하도록 안내합니다.

## 에셋

- `assets/brand-logo.png`: 제공된 명함에서 중앙 로고 영역만 분리한 이미지.
- `assets/real-apple-box.webp`: 제공된 실제 포장 사진.
- `assets/apple-table-hero.png`: 내장 image_gen으로 생성한 메인 연출 사진.
- `assets/apple-products.png`: 내장 image_gen으로 생성한 3분할 상품 연출 사진. CSS로 각 영역을 표시합니다.
- `assets/IMAGE-PROMPTS.txt`: 이미지 생성 프롬프트와 제작 기록.
- `assets/PretendardVariable.woff2`: Pretendard 1.3.9. 라이선스는 `assets/Pretendard-LICENSE.txt`.

## 검증

`node --check app.js`로 문법을 확인했습니다.
실행 중인 로컬 서버에서 `python output/qa/check-site.py`로 데스크톱·모바일, 로컬 폰트 로딩,
페이지 이동, 선택 가격, 추가금, 수량, 주문 목록 저장·변경·삭제, 메뉴 및 FAQ를 확인할 수 있습니다.
검증용 스크립트는 로컬 Python Playwright와 설치된 Chrome을 사용합니다.
시각 확인용 스크린샷은 `output/qa/`에 저장됩니다.

레퍼런스: https://www.graza.co/
