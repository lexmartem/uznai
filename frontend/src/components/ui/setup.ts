import { execSync } from 'child_process';

const components = [
    'button',
    'card',
    'progress',
    'radio-group',
    'label',
    'textarea',
    'checkbox',
    'alert',
];

components.forEach((component) => {
    try {
        execSync(`npx shadcn-ui@latest add ${component}`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Failed to add ${component}:`, error);
    }
}); 