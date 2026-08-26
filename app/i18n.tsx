"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { generatedMessages } from "./i18n.generated";

export const languages = [
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "zh-CN", flag: "🇨🇳", label: "简体中文" },
  { code: "ko", flag: "🇰🇷", label: "한국어" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "zh-TW", flag: "🇭🇰", label: "繁體中文" },
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
] as const;

export type Locale = (typeof languages)[number]["code"];

const messages: Record<Locale, Record<string, string>> = {
  en: {
    "UTXO story":
      "Example: The sender has a {input} BTC UTXO and wants the recipient to receive exactly {recipient} BTC. The remainder returns to the sender after the fee.",
  },
  "zh-CN": {
    Navigation: "导航",
    "Blockchain Lab": "区块链实验室",
    "Corelia Academy Lab": "Corelia Academy 实验室",
    "Learn blockchain by doing": "通过实践学习区块链",
    "Choose a demo and explore each concept interactively.": "选择一个演示，以互动方式探索每个概念。",
    Foundations: "基础知识",
    "Blockchain Networks": "区块链网络",
    Cryptography: "密码学",
    "See how data becomes a SHA-256 hash.": "了解数据如何转换为 SHA-256 哈希。",
    "Change block data and restore a valid hash.": "修改区块数据并恢复有效哈希。",
    "Explore how hashes connect a chain of blocks.": "探索哈希如何连接区块链。",
    "Compare independent copies of the same chain.": "比较同一条链的独立副本。",
    "Follow token transfers across blocks and peers.": "跟踪区块和节点之间的代币转账。",
    "Explore Bitcoin transactions, fees and block rewards.": "探索 Bitcoin 交易、手续费和区块奖励。",
    "Build one Bitcoin transaction from an unspent output.": "使用未花费输出构建一笔 Bitcoin 交易。",
    "Learn accounts, nonces, gas and block validation.": "学习账户、nonce、Gas 和区块验证。",
    "Explore slots, instructions and transaction fees.": "探索时隙、指令和交易费用。",
    "Generate a public and private key pair.": "生成公钥和私钥对。",
    "Sign a message and verify its signature.": "签署消息并验证签名。",
    "Create and verify a signed transaction.": "创建并验证已签名交易。",
    "View source on GitHub": "在 GitHub 查看源代码",
    Algorithm: "算法：",
    "ECDSA with the NIST P-256 curve (secp256r1). Signatures use SHA-256. This is not Bitcoin's secp256k1 curve.":
      "使用 NIST P-256 曲线（secp256r1）的 ECDSA。签名使用 SHA-256。这不是 Bitcoin 使用的 secp256k1 曲线。",
    "− Amount sent": "− 已发送金额",
    "− Miner fee": "− 矿工费",
    "= Change returned": "= 返回找零",
    Random: "随机生成",
    Peer: "节点",
    "Change output": "找零输出",
    Satoshi: "聪",
    "Gas limit": "Gas 上限",
    "Gas used": "已使用 Gas",
    Slot: "时隙",
    Instruction: "指令",
    "Priority fee (micro-lamports per CU)": "优先费（每 CU 的 micro-lamports）",
    "The sender's UTXO referenced by a transaction for spending.":
      "交易引用的发送方UTXO，用于支出。",
    "Account nonce": "账户 nonce",
    "Mining...": "挖矿中...",
    Invalid: "无效",
    "Signature verified.": "签名验证成功。",
    "Invalid signature.": "签名无效。",
    "Transaction signature verified.": "交易签名验证成功。",
    "Invalid transaction signature.": "交易签名无效。",
    "UTXO story":
      "示例：发送方拥有一个 {input} BTC 的 UTXO，并希望接收方正好收到 {recipient} BTC。扣除手续费后，剩余金额会返回给发送方。",
    "Real Blockchain Work with Bitcoin": "比特币区块链如何运作",
    Blockchain: "区块链",
    Distributed: "分布式",
    Tokens: "代币",
    Keys: "密钥",
    Signatures: "签名",
    Transaction: "交易",
    Block: "区块",
    Nonce: "随机数",
    Data: "数据",
    Previous: "上一个",
    Hash: "哈希",
    Mine: "挖矿",
    Validate: "验证",
    Process: "处理",
    "Previous block hash": "上一个区块哈希",
    "Current block hash": "当前区块哈希",
    "Token transactions": "代币交易",
    "Bitcoin transactions": "比特币交易",
    "Block subsidy": "区块补贴",
    "Transaction fees": "交易手续费",
    "Total miner reward": "矿工总奖励",
    "Block reward transaction": "区块奖励交易",
    "Ethereum uses accounts, transaction nonces and gas. Validators propose and attest blocks, so this demo validates blocks instead of mining them.":
      "以太坊使用账户、交易 nonce 和 Gas。验证者提议并确认区块，因此本演示验证区块而不是挖矿。",
    "Solana groups transactions into slots. Validators process signed instructions using a recent blockhash, accounts and onchain programs.":
      "Solana 将交易组织到时隙中。验证者使用近期区块哈希、账户和链上程序处理已签名指令。",
    "Simulation data notice": "模拟数据说明",
    Language: "语言",
  },
  ko: {
    Navigation: "탐색",
    "Blockchain Lab": "블록체인 실습실",
    "Corelia Academy Lab": "Corelia Academy 실습실",
    "Learn blockchain by doing": "직접 해보며 블록체인 배우기",
    "Choose a demo and explore each concept interactively.": "데모를 선택하고 각 개념을 직접 탐색해 보세요.",
    Foundations: "기초",
    "Blockchain Networks": "블록체인 네트워크",
    Cryptography: "암호학",
    "See how data becomes a SHA-256 hash.": "데이터가 SHA-256 해시가 되는 과정을 확인합니다.",
    "Change block data and restore a valid hash.": "블록 데이터를 바꾸고 유효한 해시를 복원합니다.",
    "Explore how hashes connect a chain of blocks.": "해시가 블록 체인을 연결하는 방식을 탐색합니다.",
    "Compare independent copies of the same chain.": "동일한 체인의 독립 복사본을 비교합니다.",
    "Follow token transfers across blocks and peers.": "블록과 피어 간 토큰 이동을 추적합니다.",
    "Explore Bitcoin transactions, fees and block rewards.": "Bitcoin 거래, 수수료와 블록 보상을 탐색합니다.",
    "Build one Bitcoin transaction from an unspent output.": "미사용 출력으로 Bitcoin 거래를 구성합니다.",
    "Learn accounts, nonces, gas and block validation.": "계정, 논스, 가스와 블록 검증을 학습합니다.",
    "Explore slots, instructions and transaction fees.": "슬롯, 인스트럭션과 거래 수수료를 탐색합니다.",
    "Generate a public and private key pair.": "공개 키와 개인 키 쌍을 생성합니다.",
    "Sign a message and verify its signature.": "메시지에 서명하고 서명을 검증합니다.",
    "Create and verify a signed transaction.": "서명된 거래를 만들고 검증합니다.",
    "View source on GitHub": "GitHub에서 소스 보기",
    Algorithm: "알고리즘:",
    "ECDSA with the NIST P-256 curve (secp256r1). Signatures use SHA-256. This is not Bitcoin's secp256k1 curve.":
      "NIST P-256 곡선(secp256r1)을 사용하는 ECDSA입니다. 서명에는 SHA-256을 사용합니다. Bitcoin의 secp256k1 곡선과는 다릅니다.",
    "− Amount sent": "− 송금액",
    "− Miner fee": "− 채굴자 수수료",
    "= Change returned": "= 반환되는 잔돈",
    Random: "무작위 생성",
    Peer: "피어",
    "Change output": "잔돈 출력",
    Satoshi: "사토시",
    "Gas limit": "가스 한도",
    "Gas used": "사용된 가스",
    Slot: "슬롯",
    Instruction: "인스트럭션",
    "Priority fee (micro-lamports per CU)": "우선 수수료(CU당 micro-lamports)",
    "The sender's UTXO referenced by a transaction for spending.":
      "지출을 위해 트랜잭션이 참조하는 송신자의 UTXO입니다.",
    "Mining...": "채굴 중...",
    Invalid: "유효하지 않음",
    "Signature verified.": "서명이 확인되었습니다.",
    "Invalid signature.": "유효하지 않은 서명입니다.",
    "Transaction signature verified.": "트랜잭션 서명이 확인되었습니다.",
    "Invalid transaction signature.": "유효하지 않은 트랜잭션 서명입니다.",
    "UTXO story":
      "예시: 송신자는 {input} BTC UTXO를 가지고 있으며 수신자가 정확히 {recipient} BTC를 받도록 합니다. 수수료를 제외한 나머지는 송신자에게 반환됩니다.",
    "Real Blockchain Work with Bitcoin": "비트코인 블록체인의 작동 방식",
    Blockchain: "블록체인",
    Distributed: "분산",
    Tokens: "토큰",
    Keys: "키",
    Signatures: "서명",
    Transaction: "트랜잭션",
    Block: "블록",
    Nonce: "논스",
    Data: "데이터",
    Previous: "이전",
    Hash: "해시",
    Mine: "채굴",
    Validate: "검증",
    Process: "처리",
    "Previous block hash": "이전 블록 해시",
    "Current block hash": "현재 블록 해시",
    "Token transactions": "토큰 트랜잭션",
    "Bitcoin transactions": "비트코인 트랜잭션",
    "Block subsidy": "블록 보조금",
    "Transaction fees": "트랜잭션 수수료",
    "Total miner reward": "총 채굴자 보상",
    "Block reward transaction": "블록 보상 트랜잭션",
    "Ethereum uses accounts, transaction nonces and gas. Validators propose and attest blocks, so this demo validates blocks instead of mining them.":
      "이더리움은 계정, 트랜잭션 논스와 가스를 사용합니다. 검증자가 블록을 제안하고 증명하므로 이 데모는 채굴 대신 블록을 검증합니다.",
    "Solana groups transactions into slots. Validators process signed instructions using a recent blockhash, accounts and onchain programs.":
      "솔라나는 트랜잭션을 슬롯으로 묶습니다. 검증자는 최근 블록해시, 계정과 온체인 프로그램으로 서명된 명령을 처리합니다.",
    "Simulation data notice": "시뮬레이션 데이터 안내",
    Language: "언어",
  },
  es: {
    Navigation: "Navegación",
    "Blockchain Lab": "Laboratorio blockchain",
    "Corelia Academy Lab": "Laboratorio de Corelia Academy",
    "Learn blockchain by doing": "Aprende blockchain practicando",
    "Choose a demo and explore each concept interactively.": "Elige una demo y explora cada concepto de forma interactiva.",
    Foundations: "Fundamentos",
    "Blockchain Networks": "Redes blockchain",
    Cryptography: "Criptografía",
    "See how data becomes a SHA-256 hash.": "Observa cómo los datos se convierten en un hash SHA-256.",
    "Change block data and restore a valid hash.": "Cambia los datos del bloque y recupera un hash válido.",
    "Explore how hashes connect a chain of blocks.": "Explora cómo los hashes conectan una cadena de bloques.",
    "Compare independent copies of the same chain.": "Compara copias independientes de la misma cadena.",
    "Follow token transfers across blocks and peers.": "Sigue transferencias de tokens entre bloques y nodos.",
    "Explore Bitcoin transactions, fees and block rewards.": "Explora transacciones, comisiones y recompensas de Bitcoin.",
    "Build one Bitcoin transaction from an unspent output.": "Construye una transacción Bitcoin desde una salida no gastada.",
    "Learn accounts, nonces, gas and block validation.": "Aprende sobre cuentas, nonces, gas y validación.",
    "Explore slots, instructions and transaction fees.": "Explora slots, instrucciones y comisiones.",
    "Generate a public and private key pair.": "Genera un par de claves pública y privada.",
    "Sign a message and verify its signature.": "Firma un mensaje y verifica su firma.",
    "Create and verify a signed transaction.": "Crea y verifica una transacción firmada.",
    "View source on GitHub": "Ver código en GitHub",
    Algorithm: "Algoritmo:",
    "ECDSA with the NIST P-256 curve (secp256r1). Signatures use SHA-256. This is not Bitcoin's secp256k1 curve.":
      "ECDSA con la curva NIST P-256 (secp256r1). Las firmas usan SHA-256. No es la curva secp256k1 de Bitcoin.",
    "− Amount sent": "− Importe enviado",
    "− Miner fee": "− Comisión del minero",
    "= Change returned": "= Cambio devuelto",
    Random: "Generar al azar",
    Peer: "Nodo",
    "Change output": "Salida de cambio",
    Satoshi: "Satoshi",
    "Gas limit": "Límite de gas",
    "Gas used": "Gas usado",
    Slot: "Slot",
    Instruction: "Instrucción",
    "Priority fee (micro-lamports per CU)":
      "Comisión prioritaria (micro-lamports por CU)",
    "The sender's UTXO referenced by a transaction for spending.":
      "El UTXO del remitente que la transacción referencia para gastarlo.",
    "Mining...": "Minando...",
    Invalid: "No válido",
    "Signature verified.": "Firma verificada.",
    "Invalid signature.": "Firma no válida.",
    "Transaction signature verified.": "Firma de transacción verificada.",
    "Invalid transaction signature.": "Firma de transacción no válida.",
    "UTXO story":
      "Ejemplo: el remitente tiene un UTXO de {input} BTC y quiere que el destinatario reciba exactamente {recipient} BTC. El resto vuelve al remitente después de la comisión.",
    "Real Blockchain Work with Bitcoin":
      "Cómo funciona la blockchain de Bitcoin",
    Blockchain: "Cadena de bloques",
    Distributed: "Distribuido",
    Tokens: "Tokens",
    Keys: "Claves",
    Signatures: "Firmas",
    Transaction: "Transacción",
    Block: "Bloque",
    Nonce: "Nonce",
    Data: "Datos",
    Previous: "Anterior",
    Hash: "Hash",
    Mine: "Minar",
    Validate: "Validar",
    Process: "Procesar",
    "Previous block hash": "Hash del bloque anterior",
    "Current block hash": "Hash del bloque actual",
    "Token transactions": "Transacciones de tokens",
    "Bitcoin transactions": "Transacciones de Bitcoin",
    "Block subsidy": "Subsidio del bloque",
    "Transaction fees": "Comisiones",
    "Total miner reward": "Recompensa total del minero",
    "Block reward transaction": "Transacción de recompensa",
    "Ethereum uses accounts, transaction nonces and gas. Validators propose and attest blocks, so this demo validates blocks instead of mining them.":
      "Ethereum usa cuentas, nonces de transacción y gas. Los validadores proponen y certifican bloques, por eso esta demo valida en lugar de minar.",
    "Solana groups transactions into slots. Validators process signed instructions using a recent blockhash, accounts and onchain programs.":
      "Solana agrupa transacciones en slots. Los validadores procesan instrucciones firmadas usando un blockhash reciente, cuentas y programas onchain.",
    "Simulation data notice": "Aviso de datos simulados",
    Language: "Idioma",
  },
  "zh-TW": {
    Navigation: "導覽",
    "Blockchain Lab": "區塊鏈實驗室",
    "Corelia Academy Lab": "Corelia Academy 實驗室",
    "Learn blockchain by doing": "透過實作學習區塊鏈",
    "Choose a demo and explore each concept interactively.": "選擇示範，以互動方式探索每個概念。",
    Foundations: "基礎知識",
    "Blockchain Networks": "區塊鏈網路",
    Cryptography: "密碼學",
    "See how data becomes a SHA-256 hash.": "了解資料如何轉換為 SHA-256 雜湊。",
    "Change block data and restore a valid hash.": "修改區塊資料並恢復有效雜湊。",
    "Explore how hashes connect a chain of blocks.": "探索雜湊如何連接區塊鏈。",
    "Compare independent copies of the same chain.": "比較同一條鏈的獨立副本。",
    "Follow token transfers across blocks and peers.": "追蹤區塊和節點之間的代幣轉移。",
    "Explore Bitcoin transactions, fees and block rewards.": "探索 Bitcoin 交易、手續費和區塊獎勵。",
    "Build one Bitcoin transaction from an unspent output.": "使用未花費輸出建立一筆 Bitcoin 交易。",
    "Learn accounts, nonces, gas and block validation.": "學習帳戶、nonce、Gas 和區塊驗證。",
    "Explore slots, instructions and transaction fees.": "探索時隙、指令和交易費用。",
    "Generate a public and private key pair.": "產生公鑰和私鑰對。",
    "Sign a message and verify its signature.": "簽署訊息並驗證簽章。",
    "Create and verify a signed transaction.": "建立並驗證已簽署交易。",
    "View source on GitHub": "在 GitHub 查看原始碼",
    Algorithm: "演算法：",
    "ECDSA with the NIST P-256 curve (secp256r1). Signatures use SHA-256. This is not Bitcoin's secp256k1 curve.":
      "使用 NIST P-256 曲線（secp256r1）的 ECDSA。簽章使用 SHA-256。這不是 Bitcoin 使用的 secp256k1 曲線。",
    "− Amount sent": "− 已發送金額",
    "− Miner fee": "− 礦工費",
    "= Change returned": "= 退回找零",
    Random: "隨機產生",
    Peer: "對等節點",
    "Change output": "找零輸出",
    Satoshi: "聰",
    "Gas limit": "Gas 上限",
    "Gas used": "已使用 Gas",
    Slot: "時隙",
    Instruction: "指令",
    "Priority fee (micro-lamports per CU)": "優先費（每 CU 的 micro-lamports）",
    "The sender's UTXO referenced by a transaction for spending.":
      "交易引用的發送方UTXO，用於支出。",
    "Private Key": "私鑰",
    "Public Key": "公鑰",
    "Account nonce": "帳戶 nonce",
    "Mining...": "挖礦中...",
    Invalid: "無效",
    "Signature verified.": "簽章驗證成功。",
    "Invalid signature.": "簽章無效。",
    "Transaction signature verified.": "交易簽章驗證成功。",
    "Invalid transaction signature.": "交易簽章無效。",
    "UTXO story":
      "範例：發送方擁有一個 {input} BTC 的 UTXO，並希望接收方正好收到 {recipient} BTC。扣除手續費後，剩餘金額會退回發送方。",
    "Real Blockchain Work with Bitcoin": "比特幣區塊鏈如何運作",
    Blockchain: "區塊鏈",
    Distributed: "分散式",
    Tokens: "代幣",
    Keys: "金鑰",
    Signatures: "簽章",
    Transaction: "交易",
    Block: "區塊",
    Nonce: "隨機數",
    Data: "資料",
    Previous: "上一個",
    Hash: "雜湊",
    Mine: "挖礦",
    Validate: "驗證",
    Process: "處理",
    "Previous block hash": "上一個區塊雜湊",
    "Current block hash": "目前區塊雜湊",
    "Token transactions": "代幣交易",
    "Bitcoin transactions": "比特幣交易",
    "Block subsidy": "區塊補貼",
    "Transaction fees": "交易手續費",
    "Total miner reward": "礦工總獎勵",
    "Block reward transaction": "區塊獎勵交易",
    "Ethereum uses accounts, transaction nonces and gas. Validators propose and attest blocks, so this demo validates blocks instead of mining them.":
      "以太坊使用帳戶、交易 nonce 與 Gas。驗證者提議並確認區塊，因此本示範驗證區塊而非挖礦。",
    "Solana groups transactions into slots. Validators process signed instructions using a recent blockhash, accounts and onchain programs.":
      "Solana 將交易組織到時隙中。驗證者使用近期區塊雜湊、帳戶與鏈上程式處理已簽署指令。",
    "Simulation data notice": "模擬資料說明",
    Language: "語言",
  },
  vi: {
    Navigation: "Điều hướng",
    "Blockchain Lab": "Phòng lab Blockchain",
    "Corelia Academy Lab": "Phòng lab Corelia Academy",
    "Learn blockchain by doing": "Học blockchain qua thực hành",
    "Choose a demo and explore each concept interactively.": "Chọn một demo và khám phá từng khái niệm theo cách tương tác.",
    Foundations: "Nền tảng",
    "Blockchain Networks": "Mạng blockchain",
    Cryptography: "Mật mã học",
    "See how data becomes a SHA-256 hash.": "Xem dữ liệu được chuyển thành hash SHA-256 như thế nào.",
    "Change block data and restore a valid hash.": "Thay đổi dữ liệu block và khôi phục hash hợp lệ.",
    "Explore how hashes connect a chain of blocks.": "Khám phá cách hash kết nối một chuỗi block.",
    "Compare independent copies of the same chain.": "So sánh các bản sao độc lập của cùng một chain.",
    "Follow token transfers across blocks and peers.": "Theo dõi token di chuyển qua các block và peer.",
    "Explore Bitcoin transactions, fees and block rewards.": "Khám phá giao dịch, phí và phần thưởng block của Bitcoin.",
    "Build one Bitcoin transaction from an unspent output.": "Tạo một giao dịch Bitcoin từ output chưa được sử dụng.",
    "Learn accounts, nonces, gas and block validation.": "Tìm hiểu account, nonce, gas và xác thực block.",
    "Explore slots, instructions and transaction fees.": "Khám phá slot, instruction và phí giao dịch.",
    "Generate a public and private key pair.": "Tạo một cặp public key và private key.",
    "Sign a message and verify its signature.": "Ký message và xác thực chữ ký.",
    "Create and verify a signed transaction.": "Tạo và xác thực một giao dịch đã ký.",
    "View source on GitHub": "Xem mã nguồn trên GitHub",
    Algorithm: "Thuật toán:",
    "ECDSA with the NIST P-256 curve (secp256r1). Signatures use SHA-256. This is not Bitcoin's secp256k1 curve.":
      "ECDSA với đường cong NIST P-256 (secp256r1). Chữ ký sử dụng SHA-256. Đây không phải đường cong secp256k1 của Bitcoin.",
    "− Amount sent": "− Số tiền gửi",
    "− Miner fee": "− Phí miner",
    "= Change returned": "= Tiền thừa hoàn lại",
    Random: "Tạo ngẫu nhiên",
    Peer: "Peer",
    "Change output": "Đầu ra tiền thừa",
    Satoshi: "Satoshi",
    "Gas limit": "Giới hạn gas",
    "Gas used": "Gas đã dùng",
    Slot: "Slot",
    Instruction: "Instruction",
    "Priority fee (micro-lamports per CU)":
      "Phí ưu tiên (micro-lamports mỗi CU)",
    "The sender's UTXO referenced by a transaction for spending.":
      "UTXO của người gửi được transaction tham chiếu để chi tiêu.",
    "Blockchain Demo": "Demo Blockchain",
    "Mining...": "Đang đào...",
    Invalid: "Không hợp lệ",
    "Signature verified.": "Chữ ký đã được xác thực.",
    "Invalid signature.": "Chữ ký không hợp lệ.",
    "Transaction signature verified.": "Chữ ký giao dịch đã được xác thực.",
    "Invalid transaction signature.": "Chữ ký giao dịch không hợp lệ.",
    "UTXO story":
      "Ví dụ: Người gửi có UTXO {input} BTC và muốn người nhận nhận chính xác {recipient} BTC. Phần còn lại sau khi trừ phí sẽ quay về người gửi.",
    "Real Blockchain Work with Bitcoin": "Cách blockchain Bitcoin hoạt động",
    Blockchain: "Chuỗi khối",
    Distributed: "Phân tán",
    Tokens: "Token",
    Keys: "Khóa",
    Signatures: "Chữ ký",
    Transaction: "Giao dịch",
    Block: "Khối",
    Nonce: "Nonce",
    Data: "Dữ liệu",
    Previous: "Trước đó",
    Hash: "Hash",
    Mine: "Đào",
    Validate: "Xác thực",
    Process: "Xử lý",
    "Previous block hash": "Hash của block trước",
    "Current block hash": "Hash của block hiện tại",
    "Token transactions": "Giao dịch token",
    "Bitcoin transactions": "Giao dịch Bitcoin",
    "Block subsidy": "Phần thưởng khối",
    "Transaction fees": "Phí giao dịch",
    "Total miner reward": "Tổng thưởng miner",
    "Block reward transaction": "Giao dịch thưởng khối",
    "Ethereum uses accounts, transaction nonces and gas. Validators propose and attest blocks, so this demo validates blocks instead of mining them.":
      "Ethereum sử dụng tài khoản, transaction nonce và gas. Validator đề xuất và chứng thực block, vì vậy demo này xác thực block thay vì mining.",
    "Solana groups transactions into slots. Validators process signed instructions using a recent blockhash, accounts and onchain programs.":
      "Solana nhóm transaction theo slot. Validator xử lý instruction đã ký bằng recent blockhash, account và chương trình onchain.",
    "Simulation data notice": "Lưu ý dữ liệu mô phỏng",
    Language: "Ngôn ngữ",
  },
  ja: {
    Navigation: "ナビゲーション",
    "Blockchain Lab": "ブロックチェーンラボ",
    "Corelia Academy Lab": "Corelia Academy ラボ",
    "Learn blockchain by doing": "体験しながらブロックチェーンを学ぶ",
    "Choose a demo and explore each concept interactively.": "デモを選び、各概念をインタラクティブに学びましょう。",
    Foundations: "基礎",
    "Blockchain Networks": "ブロックチェーンネットワーク",
    Cryptography: "暗号技術",
    "See how data becomes a SHA-256 hash.": "データが SHA-256 ハッシュになる仕組みを確認します。",
    "Change block data and restore a valid hash.": "ブロックデータを変更し、有効なハッシュを復元します。",
    "Explore how hashes connect a chain of blocks.": "ハッシュがブロックをつなぐ仕組みを学びます。",
    "Compare independent copies of the same chain.": "同じチェーンの独立したコピーを比較します。",
    "Follow token transfers across blocks and peers.": "ブロックとピア間のトークン移動を追跡します。",
    "Explore Bitcoin transactions, fees and block rewards.": "Bitcoin の取引、手数料、ブロック報酬を学びます。",
    "Build one Bitcoin transaction from an unspent output.": "未使用出力から Bitcoin 取引を構築します。",
    "Learn accounts, nonces, gas and block validation.": "アカウント、nonce、Gas、ブロック検証を学びます。",
    "Explore slots, instructions and transaction fees.": "スロット、命令、取引手数料を学びます。",
    "Generate a public and private key pair.": "公開鍵と秘密鍵のペアを生成します。",
    "Sign a message and verify its signature.": "メッセージに署名し、その署名を検証します。",
    "Create and verify a signed transaction.": "署名済み取引を作成して検証します。",
    "View source on GitHub": "GitHubでソースを見る",
    Algorithm: "アルゴリズム：",
    "ECDSA with the NIST P-256 curve (secp256r1). Signatures use SHA-256. This is not Bitcoin's secp256k1 curve.":
      "NIST P-256曲線（secp256r1）を使用するECDSAです。署名にはSHA-256を使用します。Bitcoinのsecp256k1曲線ではありません。",
    "− Amount sent": "− 送金額",
    "− Miner fee": "− マイナー手数料",
    "= Change returned": "= 返却されるおつり",
    Random: "ランダム生成",
    Peer: "ピア",
    Sign: "署名",
    "Addresses and TXIDs are simulated and are not Bitcoin mainnet data.":
      "アドレスとTXIDはシミュレーション用で、Bitcoinメインネットのデータではありません。",
    Glossary: "用語集",
    "Unspent Transaction Output: BTC that has not been spent and can become an input to a new transaction.":
      "未使用トランザクション出力：まだ使用されておらず、新しいトランザクションの入力として使えるBTCです。",
    "The hash identifier of a Bitcoin transaction.":
      "Bitcoinトランザクションを識別するハッシュです。",
    "The index of the output in the transaction referenced by the TXID.":
      "TXIDが参照するトランザクション内の出力番号です。",
    Input: "入力",
    "The sender's UTXO referenced by a transaction for spending.":
      "支払いのためにトランザクションが参照する送信者のUTXOです。",
    "Amount sent": "送金額",
    "The exact BTC received by the recipient; the miner fee is separate.":
      "受信者が受け取る正確なBTC額です。マイナー手数料は別です。",
    "Change output": "おつりの出力",
    "The remaining BTC returned to the sender.":
      "送信者へ返される残りのBTCです。",
    "Transaction fee": "トランザクション手数料",
    "The fee paid by the sender to the miner, separate from the received amount.":
      "受取額とは別に、送信者がマイナーへ支払う手数料です。",
    Satoshi: "サトシ",
    "The smallest Bitcoin unit; 100,000,000 sats = 1 BTC.":
      "Bitcoinの最小単位です。100,000,000 sats = 1 BTCです。",
    "Block subsidy": "ブロック補助金",
    "New BTC created by the protocol in a block as a miner reward.":
      "プロトコルがブロック内で新規発行し、マイナーへ与えるBTCです。",
    "The block number in this simulated chain.":
      "このシミュレーションチェーンのブロック番号です。",
    "Base fee (Gwei)": "基本手数料（Gwei）",
    "The protocol-defined base fee for this block.":
      "プロトコルが定めるこのブロックの基本手数料です。",
    "Ethereum transaction": "Ethereumトランザクション",
    Sender: "送信者",
    "The account signing and sending the transaction.":
      "トランザクションに署名して送信するアカウントです。",
    Recipient: "受信者",
    "The account receiving ETH.": "ETHを受け取るアカウントです。",
    "Value (ETH)": "金額（ETH）",
    "Account nonce": "アカウントnonce",
    "The number of transactions sent by this account.":
      "このアカウントから送信済みのトランザクション数です。",
    "Gas limit": "Gas上限",
    "Max fee (Gwei)": "最大手数料（Gwei）",
    "Gas used": "使用Gas",
    "Estimated maximum fee": "推定最大手数料",
    "Addresses and hashes are simulated and are not Ethereum mainnet data.":
      "アドレスとハッシュはシミュレーション用で、Ethereumメインネットのデータではありません。",
    Slot: "スロット",
    "A time window in which a validator may produce a block.":
      "バリデーターがブロックを生成できる時間枠です。",
    "The simulated base fee plus priority fee.":
      "シミュレーション上の基本手数料と優先手数料の合計です。",
    "Solana transaction": "Solanaトランザクション",
    "Fee payer": "手数料支払者",
    "The account paying the transaction fee.":
      "トランザクション手数料を支払うアカウントです。",
    Signer: "署名者",
    "The account signing to authorize execution.":
      "実行を承認するために署名するアカウントです。",
    "Recent blockhash": "recent blockhash",
    "A recent hash that gives the transaction a lifetime and prevents replay.":
      "トランザクションに有効期限を与え、再実行を防ぐ最近のハッシュです。",
    "Compute units": "コンピュートユニット",
    "Priority fee (micro-lamports per CU)":
      "優先手数料（CUあたりmicro-lamports）",
    Instruction: "命令",
    Program: "プログラム",
    "The onchain program processing the instruction.":
      "命令を処理するオンチェーンプログラムです。",
    Accounts: "アカウント",
    "The accounts read or written by the instruction.":
      "命令が読み書きするアカウントです。",
    "Instruction data": "命令データ",
    "Previous slot hash": "前のスロットハッシュ",
    "Current slot hash": "現在のスロットハッシュ",
    "Addresses, signatures and hashes are simulated and are not Solana mainnet data.":
      "アドレス、署名、ハッシュはシミュレーション用で、Solanaメインネットのデータではありません。",
    "Mining...": "マイニング中...",
    Invalid: "無効",
    "Signature verified.": "署名を検証しました。",
    "Invalid signature.": "署名が無効です。",
    "Transaction signature verified.": "トランザクション署名を検証しました。",
    "Invalid transaction signature.": "トランザクション署名が無効です。",
    "UTXO story":
      "例：送信者は {input} BTC のUTXOを持ち、受信者に正確に {recipient} BTCを届けます。手数料を引いた残りは送信者に返されます。",
    "Real Blockchain Work with Bitcoin":
      "ビットコイン・ブロックチェーンの仕組み",
    Blockchain: "ブロックチェーン",
    Distributed: "分散",
    Tokens: "トークン",
    Keys: "鍵",
    Signatures: "署名",
    Transaction: "トランザクション",
    Block: "ブロック",
    Nonce: "ナンス",
    Data: "データ",
    Previous: "前",
    Hash: "ハッシュ",
    Mine: "マイニング",
    Validate: "検証",
    Process: "処理",
    "Previous block hash": "前のブロックハッシュ",
    "Current block hash": "現在のブロックハッシュ",
    "Token transactions": "トークントランザクション",
    "Bitcoin transactions": "ビットコイントランザクション",
    "Block subsidy": "ブロック補助金",
    "Transaction fees": "取引手数料",
    "Total miner reward": "マイナー報酬合計",
    "Block reward transaction": "ブロック報酬トランザクション",
    "Ethereum uses accounts, transaction nonces and gas. Validators propose and attest blocks, so this demo validates blocks instead of mining them.":
      "Ethereumはアカウント、トランザクションnonce、Gasを使用します。バリデーターがブロックを提案・証明するため、このデモではマイニングではなく検証を行います。",
    "Solana groups transactions into slots. Validators process signed instructions using a recent blockhash, accounts and onchain programs.":
      "Solanaはトランザクションをスロットにまとめます。バリデーターはrecent blockhash、アカウント、オンチェーンプログラムを使って署名済み命令を処理します。",
    "Simulation data notice": "シミュレーションデータについて",
    Language: "言語",
  },
};

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
};
const I18nContext = createContext<I18nValue>({
  locale: "en",
  setLocale: () => undefined,
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  useEffect(() => {
    const saved = localStorage.getItem("corelia-language") as Locale | null;
    if (saved && languages.some((item) => item.code === saved)) {
      const timer = window.setTimeout(() => setLocaleState(saved), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);
  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem("corelia-language", next);
  }
  function t(key: string, values: Record<string, string | number> = {}) {
    const generated = locale === "en" ? undefined : generatedMessages[locale];
    const template =
      messages[locale][key] ??
      (generated as Record<string, string> | undefined)?.[key] ??
      key;
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in values ? String(values[name]) : match,
    );
  }
  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);

function translateNode(node: ReactNode, t: (key: string) => string): ReactNode {
  if (typeof node === "string") {
    const match = node.match(/^(\s*)(.*?)(\s*)$/s);
    if (!match || !match[2]) return node;
    return `${match[1]}${t(match[2])}${match[3]}`;
  }
  if (Array.isArray(node)) return node.map((item) => translateNode(item, t));
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>;
  const props = element.props;
  const translatedProps: Record<string, unknown> = {};
  for (const name of ["aria-label", "placeholder", "title"] as const) {
    if (typeof props[name] === "string") translatedProps[name] = t(props[name]);
  }
  if ("children" in props)
    translatedProps.children = Children.map(
      props.children as ReactNode,
      (child) => translateNode(child, t),
    );
  return cloneElement(element, translatedProps);
}

export function Localized({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return <>{translateNode(children, t)}</>;
}
