import { Input } from "../events/input" // Nhập lớp Input từ thư mục events
import { GameEvent } from "../events/gameevent" // Nhập lớp GameEvent từ thư mục events
import { StationaryEvent } from "../events/stationaryevent" // Nhập lớp StationaryEvent từ thư mục events
import { Controller } from "../controller/controller" // Nhập lớp Controller từ thư mục controller
import { Table } from "../model/table" // Nhập lớp Table từ thư mục model
import { View } from "../view/view" // Nhập lớp View từ thư mục view
import { Init } from "../controller/init" // Nhập lớp Init từ thư mục controller
import { AimInputs } from "../view/aiminputs" // Nhập lớp AimInputs từ thư mục view
import { Keyboard } from "../events/keyboard" // Nhập lớp Keyboard từ thư mục events
import { Sound } from "../view/sound" // Nhập lớp Sound từ thư mục view
import { controllerName } from "../controller/util" // Nhập hàm controllerName từ thư mục controller/util
import { Chat } from "../view/chat" // Nhập lớp Chat từ thư mục view
import { ChatEvent } from "../events/chatevent" // Nhập lớp ChatEvent từ thư mục events
import { Throttle } from "../events/throttle" // Nhập lớp Throttle từ thư mục events
import { Sliders } from "../view/sliders" // Nhập lớp Sliders từ thư mục view
import { Recorder } from "../events/recorder" // Nhập lớp Recorder từ thư mục events
import { Rules } from "../rules/rules" // Nhập lớp Rules từ thư mục controller/rules
import { RuleFactory } from "../rules/rulefactory" // Nhập lớp RuleFactory từ thư mục controller/rules
import { Menu } from "../view/menu" // Nhập lớp Menu từ thư mục view
import { Hud } from "../view/hud" // Nhập lớp Hud từ thư mục view

/**
 * Container cho Mô hình (Model), Giao diện (View), Bộ điều khiển (Controller).
 */
export class Container {
  table: Table // Đối tượng Table để quản lý bàn chơi
  view: View // Đối tượng View để quản lý giao diện
  controller: Controller // Đối tượng Controller để quản lý logic điều khiển
  inputQueue: Input[] = [] // Hàng đợi các đầu vào từ người dùng
  eventQueue: GameEvent[] = [] // Hàng đợi các sự kiện trò chơi
  keyboard: Keyboard // Đối tượng Keyboard để quản lý đầu vào từ bàn phím
  sound: Sound // Đối tượng Sound để quản lý âm thanh
  chat: Chat // Đối tượng Chat để quản lý tính năng chat
  sliders: Sliders // Đối tượng Sliders để quản lý các thanh trượt
  recorder: Recorder // Đối tượng Recorder để quản lý ghi lại sự kiện
  id: string = "" // ID của người chơi hoặc phiên chơi
  isSinglePlayer: boolean = true // Cờ để xác định chế độ chơi đơn hay đa người chơi
  rules: Rules // Đối tượng Rules để quản lý luật chơi
  menu: Menu // Đối tượng Menu để quản lý menu giao diện
  hud: Hud // Đối tượng Hud để quản lý hiển thị thông tin trên màn hình

  last = performance.now() // Lưu trữ thời gian lần cuối cùng vòng lặp animation chạy
  readonly step = 0.001953125 * 1 // Bước tiến của thời gian trong vòng lặp animation

  broadcast: (event: GameEvent) => void // Hàm callback để phát sự kiện
  log: (text: string) => void // Hàm callback để ghi log

  constructor(element, log, assets, ruletype?, keyboard?, id?) {
    this.log = log // Gán hàm log từ tham số truyền vào
    this.rules = RuleFactory.create(ruletype, this) // Tạo đối tượng Rules từ RuleFactory dựa trên loại luật chơi
    this.table = this.rules.table() // Lấy đối tượng Table từ Rules
    this.view = new View(element, this.table, assets) // Tạo đối tượng View với các tham số truyền vào
    this.table.cue.aimInputs = new AimInputs(this) // Gán đối tượng AimInputs cho cue của Table
    this.keyboard = keyboard // Gán đối tượng Keyboard từ tham số truyền vào
    this.sound = assets.sound // Gán đối tượng Sound từ assets
    this.chat = new Chat(this.sendChat) // Tạo đối tượng Chat với hàm sendChat
    this.sliders = new Sliders() // Tạo đối tượng Sliders
    this.recorder = new Recorder(this) // Tạo đối tượng Recorder
    this.id = id // Gán ID từ tham số truyền vào
    this.menu = new Menu(this) // Tạo đối tượng Menu
    this.table.addToScene(this.view.scene) // Thêm Table vào scene của View
    this.hud = new Hud() // Tạo đối tượng Hud
    this.updateController(new Init(this)) // Khởi tạo bộ điều khiển với đối tượng Init
  }

  sendChat = (msg) => {
    this.sendEvent(new ChatEvent(this.id, msg)) // Gửi sự kiện chat với ID và message
  }

  throttle = new Throttle(0, (event) => {
    this.broadcast(event) // Tạo đối tượng Throttle để gửi sự kiện với tần suất giới hạn
  })

  sendEvent(event) {
    this.throttle.send(event) // Gửi sự kiện qua đối tượng Throttle
  }

  advance(elapsed) {
    // console.log("elapsed = " + elapsed)
    const steps = Math.floor(elapsed / this.step) // Tính số bước tiến cần thực hiện
    const computedElapsed = steps * this.step // Tính thời gian đã thực hiện
    const stateBefore = this.table.allStationary() // Kiểm tra trạng thái trước khi tiến
    for (let i = 0; i < steps; i++) {
      this.table.advance(this.step) // Tiến hành bước thời gian cho bàn chơi
    }
    // console.log(computedElapsed);
    this.table.updateBallMesh(computedElapsed) // Cập nhật vị trí bóng trên bàn
    this.view.update(computedElapsed, this.table.cue.aim) // Cập nhật giao diện
    this.table.cue.update(computedElapsed) // Cập nhật vị trí cue
    if (!stateBefore && this.table.allStationary()) {
      this.eventQueue.push(new StationaryEvent()) // Thêm sự kiện Stationary vào hàng đợi nếu bàn chơi đang đứng yên
    }
    this.sound.processOutcomes(this.table.outcome) // Xử lý âm thanh dựa trên kết quả bàn chơi
  }

  processEvents() {
    if (this.keyboard) {
      const inputs = this.keyboard.getEvents() // Lấy các sự kiện từ bàn phím
      inputs.forEach((i) => this.inputQueue.push(i)) // Đẩy các sự kiện vào hàng đợi đầu vào
    }

    while (this.inputQueue.length > 0) {
      this.lastEventTime = this.last // Cập nhật thời gian sự kiện cuối cùng
      const input = this.inputQueue.shift() // Lấy sự kiện đầu vào từ hàng đợi
      input && this.updateController(this.controller.handleInput(input)) // Xử lý sự kiện và cập nhật bộ điều khiển
    }

    // chỉ xử lý sự kiện khi tất cả bóng đang đứng yên
    if (this.table.allStationary()) {
      const event = this.eventQueue.shift() // Lấy sự kiện từ hàng đợi sự kiện
      if (event) {
        this.lastEventTime = performance.now() // Cập nhật thời gian sự kiện cuối cùng
        this.updateController(event.applyToController(this.controller)) // Áp dụng sự kiện và cập nhật bộ điều khiển
      }
    }
  }

  lastEventTime = performance.now() // Lưu trữ thời gian sự kiện cuối cùng

  animate(timestamp): void {
    this.advance((timestamp - this.last) / 1000) // Tiến hành bước thời gian dựa trên timestamp hiện tại
    this.last = timestamp // Cập nhật thời gian cuối cùng
    this.processEvents() // Xử lý các sự kiện
    const needsRender = timestamp < this.lastEventTime + 12000 || // Kiểm tra xem có cần render không      
      !this.table.allStationary() ||
      this.view.sizeChanged()
    if (needsRender) {
      this.view.render() // Render giao diện nếu cần
    }
    requestAnimationFrame((t) => {
      this.animate(t) // Gọi lại animate cho khung hình tiếp theo
    })
  }

  updateController(controller) {
    if (controller !== this.controller) {
      this.log("Chuyển đổi sang " + controllerName(controller)) // Ghi log khi chuyển bộ điều khiển
      this.controller = controller // Cập nhật bộ điều khiển
      this.controller.onFirst() // Gọi phương thức onFirst của bộ điều khiển mới
    }
  }
}
