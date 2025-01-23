import { LEVELS } from '../game/levels';
import type { Difficulty } from '../game/progress';

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

function generateRoutes(): string[] {
  const routes: string[] = ['/'];
  
  // Generate routes for each level and difficulty combination
  LEVELS.forEach((level) => {
    difficulties.forEach((difficulty) => {
      routes.push(`/${level.slug}/${difficulty}`);
    });
  });

  return routes;
}

// Export the routes for use in the build process
export const routes = generateRoutes();

// If running this script directly, print the routes
if (require.main === module) {
  console.log('Generated routes:');
  routes.forEach(route => console.log(route));
} 