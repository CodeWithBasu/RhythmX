import sys

with open('components/ui/animated-tab-bar.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Background color for the menu
code = code.replace('--bgColorMenu: #1d1d27;', '--bgColorMenu: rgba(20, 20, 20, 0.6);')

# 2. Make the menu a pill
if 'border-radius: 9999px;' not in code:
    code = code.replace('border-top: 1px solid rgba(255,255,255,0.05);', 
                        'border: 1px solid rgba(255,255,255,0.1);\n  border-radius: 9999px;\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);')

# 3. Add backdrop-filter to the moving border (blob) as well!
if 'backdrop-filter: blur(20px);' not in code.split('.menu__border {')[1]:
    code = code.replace('background-color: var(--bgColorMenu);', 'background-color: var(--bgColorMenu);\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);')

with open('components/ui/animated-tab-bar.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied glassmorphism")
