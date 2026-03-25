Multi-View Project Tracker
Velozity Assignment

Display three views of the same data:  (Kanban, List, and Gantt Chart).

Github link : https://github.com/CODERAKS11/Assignment-Velozity

Deployment Link : https://assignment-velozity.vercel.app/

Technical Approach & Justifications

1. State Management (React Context + useReducer)

I used React Context + useReducer to manage state across all three views (Kanban, List, Timeline). This helped keep everything in sync without re-fetching or adding extra libraries.

2. Virtual Scrolling Implementation

I implemented virtual scrolling manually to handle 500+ tasks.
It renders only visible rows
As we scroll, end and start indices are calculated.
This keeps scrolling smooth and avoids performance issues.

3. Custom Drag-and-Drop (Pointer Events)
I used pointer events so it works on both mouse and touch devices.
On drag start, I insert a placeholder of the same size
The original card becomes a dragable element that follows the pointer
All valid columns where card can be dropped are highlighted during drag
If dropped outside, it goes back to oringinal position smoothly

Lighthouse Performance Report
I achieved lighthouse score of 93 by avoiding re rendering using memoization and virtual scrolling.

<img width="772" height="725" alt="image" src="https://github.com/user-attachments/assets/f6b64e83-b313-4f96-9fb2-26ac57e6285d" />
<img width="771" height="771" alt="image" src="https://github.com/user-attachments/assets/c4cfe0b3-b41e-41f4-9db7-0c72784a141e" />

Completed by Amarjeet Kumar
1. Tech Stack: React + TypeScript + Tailwind CSS
2. Libraries: Tailwind CSS (No UI/Component/DnD/Virtual-Scroll libraries used)
