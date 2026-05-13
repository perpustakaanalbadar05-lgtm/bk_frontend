const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('/home/mustofa/Music/project/simbk/frontend/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace gradients with solid colors
    content = content.replace(/bg-gradient-to-[a-z]+\s+from-[a-z]+-\d+\s+to-[a-z]+-\d+/g, 'bg-primary-500');
    // Replace text-dark-400 with text-dark-300 for better readability on Deep Blue
    content = content.replace(/text-dark-400/g, 'text-dark-200');
    // Replace bg-dark-900/50 with bg-white/5
    content = content.replace(/bg-dark-900\/50/g, 'bg-white/5');
    // Replace bg-dark-800 with bg-white/10
    content = content.replace(/bg-dark-800/g, 'bg-white/10');
    // Change some specific border colors
    content = content.replace(/border-white\/10/g, 'border-white/20');
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Finished updating JSX files.');
