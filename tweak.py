import sys

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Fix Profile Icon fallback.
# Let's import User icon
if 'User ' not in code and 'User,' not in code and '{ User }' not in code:
    code = code.replace('Globe, ChevronDown', 'Globe, ChevronDown, User')

# Wrap ProfileDropdown or add a fallback. Actually ProfileDropdown handles it if user exists.
# I'll just put a circle icon if user doesn't exist, but we don't have direct access to user easily?
# Wait, `const { user } = useAuth()` is inside the component!
# I can just render a fallback if user is null.
old_profile = '<ProfileDropdown />'
new_profile = '{user ? <ProfileDropdown /> : <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50"><User className="w-5 h-5" /></div>}'
code = code.replace(old_profile, new_profile)

# 2. Remove Podcasts and Music buttons
old_buttons = '<button className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium">Music</button>\n            <button className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium">Podcasts</button>'
code = code.replace(old_buttons, '')
# In case Music button was typoed in my previous run or something
old_buttons_2 = '<button className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium">Music</button>'
code = code.replace(old_buttons_2, '')
code = code.replace('<button className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium">Podcasts</button>', '')


# 3. Fix the "tiles" taking up the whole screen on desktop.
# Let's make the quick play grid responsive: grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
old_grid = 'className="grid grid-cols-2 gap-2 sm:gap-3"'
new_grid = 'className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3"'
code = code.replace(old_grid, new_grid)

# 4. Make square songs smaller. They were w-[140px] h-[140px]
# Let's change them to w-[110px] h-[110px]
code = code.replace('w-[140px]', 'w-[112px]')
code = code.replace('h-[140px]', 'h-[112px]')

with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied tweaks")
