# Đánh giá `src/App.jsx` — định hướng React/Vite

Ngày đánh giá: 2026-09-15

## Vấn đề chính

### 1. Không có routing thật — chỉ giả lập bằng `useState`
```jsx
const [activeTab, setActiveTab] = useState('offers');
{activeTab === 'profile' && <UserProfile />}
```
`package.json` không có `react-router-dom`. Cách này chấp nhận được cho demo nhanh nhưng sai định hướng cho một SPA thật:
- URL không đổi theo tab → không bookmark được, không share link, nút Back/Forward của trình duyệt không hoạt động.
- Không scale khi thêm trang (đã có 7 trang trong `pages/` nhưng App.jsx chỉ biết 3 trang).

→ Nên cài `react-router-dom`, dùng `<BrowserRouter>` trong `main.jsx` và định nghĩa `<Routes>` trong `App.jsx` thay vì if/else theo state.

### 2. 4/7 page component không được wire vào đâu cả
`CreateAccount.jsx`, `Login.jsx`, `SubmitCar.jsx` tồn tại trong `pages/` nhưng `App.jsx` không import/render chúng ở đâu (kể cả không có route). Đây là code chết — không rõ là đang dở dang hay bị quên gắn.

### 3. Layout components bị bỏ hoang
`Header.jsx`, `Navbar.jsx`, `Footer.jsx` không được `App.jsx` sử dụng. Thay vào đó App.jsx tự vẽ một nav bar riêng bằng Tailwind (`bg-gray-800...`), trùng lặp chức năng với `Navbar.jsx` đã có sẵn. Ngoài ra `Navbar.jsx` dùng `<a href="index.html">`, `href="login.html"` — là liên kết kiểu multi-page HTML tĩnh, không hợp với SPA Vite (sẽ full reload thay vì client-side navigation), nên khi tích hợp router phải đổi hết sang `<Link to="...">`.

### 4. Nav bar hiện tại tự nhận là tạm thời
Comment `{/* Testing Navigation Bar */}` và `// Aapke naye components` (tiếng Hindi/Urdu, nghĩa "các component mới của bạn") cho thấy đây là code test/placeholder còn sót lại, chưa dọn trước khi merge — nên dọn hoặc thay bằng nav thật (`Navbar.jsx`) trước khi coi App.jsx là bản chính thức.

### 5. Thiếu tổ chức layout chuẩn
Không có `Layout` component bọc `Header/Navbar` + `Outlet` (route con) + `Footer`. Hiện Header/Footer phải tự import lặp lại ở từng page nếu muốn dùng — kiểm tra nhanh cho thấy chúng chưa được import ở bất kỳ đâu.

## Đề xuất hướng đi (Vite + React chuẩn)
```jsx
// main.jsx
<BrowserRouter>
  <App />
</BrowserRouter>

// App.jsx
<Routes>
  <Route element={<RootLayout />}>       {/* Navbar + Footer + <Outlet/> */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<CreateAccount />} />
    <Route path="/sell" element={<SubmitCar />} />
    <Route path="/profile" element={<UserProfile />} />
    <Route path="/offers" element={<WorkerOffers />} />
    <Route path="/appointments" element={<WorkerAppointments />} />
  </Route>
</Routes>
```

## Việc nên làm nếu muốn refactor
1. `npm install react-router-dom`
2. Tạo `RootLayout.jsx` bọc `Navbar` + `Footer` + `<Outlet />`
3. Chuyển tab-nav trong App.jsx thành `<Route>` thật, xóa nav bar tạm
4. Sửa `Navbar.jsx`: `href="*.html"` → `<Link to="/*">`
5. Gắn `Login`, `CreateAccount`, `SubmitCar` vào route

> Lưu ý: đánh giá này dừng ở mức review, chưa thực hiện thay đổi code.
