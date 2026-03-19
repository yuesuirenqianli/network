"use strict";

import { base_url } from "../config/config.js";

class LoginTest extends HTMLElement {
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
        /* 可以在这里编写特定于该组件的自定义样式 */
        .custom-box {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
        }
      </style>
      <div class="container shadow-sm p-3 mb-5 bg-body-tertiary rounded custom-box">
        <div class="alert alert-info" role="alert">
          基础测试组
        </div>
        <div class="container">
          <button type="button" id="login-btn" class="btn btn-primary">点击登录</button>
          <button type="button" id="complex-btn" class="btn btn-warning ms-2">复杂请求 (触发 OPTIONS)</button>
          <div class="mt-3">
            <p class="mb-1"><strong>状态/用户名：</strong><span id="username" class="text-success">未登录</span></p>
            <p class="mb-0"><strong>详情/Email：</strong><span id="email" class="text-success">未登录</span></p>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const loginBtn = this.shadowRoot.querySelector("#login-btn");
    loginBtn.addEventListener("click", () => this.login());

    const complexBtn = this.shadowRoot.querySelector("#complex-btn");
    complexBtn.addEventListener("click", () => this.complexRequest());
  }

  async login() {
    try {
      const res = await fetch(`${base_url}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const data = await res.json();
      this.updateResult(data.result);
    } catch (err) {
      this.updateResult(err);
    }
  }

  async complexRequest() {
    try {
      // 发送复杂请求 (Complex Request)
      // 使用 PUT 方法，并携带自定义请求头，这会强制浏览器先发送 OPTIONS 预检请求
      const res = await fetch(`${base_url}/sessions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token-123",
          "X-Custom-Header": "Trigger-Options-Preflight",
        },
        body: JSON.stringify({
          action: "test_options",
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP 错误! 状态码: ${res.status}`);
      }

      const data = await res.json();
      this.updateResult({ name: "复杂请求成功", email: JSON.stringify(data) });
    } catch (err) {
      this.updateResult({ name: "复杂请求失败", email: err.message });
    }
  }

  updateResult(data) {
    const usernameEl = this.shadowRoot.querySelector("#username");
    const emailEl = this.shadowRoot.querySelector("#email");
    usernameEl.textContent = data.name || "未知";
    emailEl.textContent = data.email || data.toString();
  }
}

export default LoginTest;
