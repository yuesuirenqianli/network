"use strict";

class XssTest extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./static/bootstrap.css" />
      <style>
        .custom-box {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
        }
      </style>
      <div class="container shadow-sm p-3 mb-5 bg-body-tertiary rounded custom-box">
        <div class="alert alert-danger" role="alert">
          XSS 攻击模拟测试组
        </div>
        <div class="container">
          <div class="mb-3">
            <label for="xss-input" class="form-label">输入恶意内容 (如含 onerror 的 img 标签)：</label>
            <input type="text" class="form-control" id="xss-input" value="<img src=x onerror=&quot;alert('XSS Attack Success! Cookie: ' + document.cookie)&quot;>">
          </div>
          <button id="inject-btn" class="btn btn-danger">执行注入 (innerHTML)</button>
          <div class="mt-3">
            <p class="mb-1"><strong>注入结果渲染区：</strong></p>
            <div id="render-area" class="p-2 border rounded bg-light" style="min-height: 50px;"></div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const btn = this.shadowRoot.querySelector("#inject-btn");
    btn.addEventListener("click", () => this.injectXss());
  }

  injectXss() {
    const input = this.shadowRoot.querySelector("#xss-input").value;
    const renderArea = this.shadowRoot.querySelector("#render-area");
    // 危险操作：直接将用户输入作为 innerHTML 渲染，导致 XSS 漏洞
    renderArea.innerHTML = input;
  }
}

export default XssTest;
