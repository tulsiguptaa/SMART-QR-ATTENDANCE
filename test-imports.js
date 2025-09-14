const fs = require('fs');
const path = require('path');

const frontendSrc = path.join(__dirname, 'frontend', 'src');

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        if (line.includes('from \'lucide-react\'')) {
            const iconMatch = line.match(/\{([^}]+)\}/);
            if (iconMatch) {
                const icons = iconMatch[1].split(',').map(icon => icon.trim());
                const problematicIcons = ['ViewIcon', 'ViewOffIcon'];

                icons.forEach(icon => {
                    if (problematicIcons.includes(icon)) {
                        console.log(`❌ ${filePath}:${index + 1} - ${icon} should be imported from @chakra-ui/icons`);
                    }
                });
            }
        }
    });
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            checkFile(filePath);
        }
    });
}

console.log('Checking for import issues...\n');
walkDir(frontendSrc);
console.log('\n✅ Import check complete!');

