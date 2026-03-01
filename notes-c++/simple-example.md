Let’s set up a "Hello World" for LibTorch. This example will show you exactly where the **Compilation** (Headers) and **Linking** (the `.so` files) happen.

### 1. The Code: `main.cpp`

This simple program creates a $2 \times 3$ random matrix (a Tensor) and prints it.

```cpp
#include <torch/torch.h> // <--- The Compiler checks this for "The Menu"
#include <iostream>

int main() {
    // This function logic lives inside libtorch.so
    torch::Tensor tensor = torch::rand({2, 3}); 
    
    std::cout << "Successfully linked LibTorch!" << std::endl;
    std::cout << tensor << std::endl;
    return 0;
}

```

---

### 2. The Coordinator: `CMakeLists.txt`

This file is the "Manager" that tells the Compiler where the headers are and tells the Linker where the `.so` files are.

```cmake
cmake_minimum_required(VERSION 3.0 FATAL_ERROR)
project(libtorch-example)

# 1. Locate the LibTorch package on your system
find_package(Torch REQUIRED)

# 2. Add your executable
add_executable(example-app main.cpp)

# 3. LINKING STAGE: Tell the linker to connect your app to the .so files
target_link_libraries(example-app "${TORCH_LIBRARIES}")

# 4. COMPILATION STAGE: Ensure C++14/17 is used (required by Torch)
set_property(TARGET example-app PROPERTY CXX_STANDARD 14)

```

---

### 3. How to Build (The "Playing" Part)

To actually see this in action, follow these steps in your terminal. This assumes you have already downloaded and unzipped [LibTorch](https://pytorch.org/get-started/locally/).

1. **Create a folder** and put both files inside it.
2. **Open your terminal** in that folder and run:

```bash
# Create a separate folder for the build files (standard practice)
mkdir build
cd build

# RUN THE COORDINATOR
# Replace /path/to/libtorch with the actual path where you unzipped it
cmake -DCMAKE_PREFIX_PATH=/path/to/libtorch ..

# RUN THE COMPILER & LINKER
make

```

---

### 4. What just happened?

If you look inside your `/build` folder after running `make`, you will see a file named `example-app`.

* **During `cmake**`: It verified the `.so` files existed in the path you gave.
* **During `make**`: It compiled `main.cpp` and linked it to `libtorch.so`.

#### **The "Moment of Truth" Test**

Run your program:

```bash
./example-app

```

If it prints a matrix, congratulations! You’ve successfully compiled and dynamically linked your first C++ AI app.

**Pro Tip:** To see the "Notes" your linker left behind, run `ldd example-app`. You will see a line like:
`libtorch.so => /your/path/libtorch/lib/libtorch.so (0x0000...)`
This confirms your program is successfully looking for that "Shared Object" at runtime.

[Getting Started with PyTorch C++](https://www.youtube.com/watch?v=RFq8HweBjHA)
