import { UnderscoreNamingStrategy } from '@mikro-orm/core';

/**
 * Esta estratégia leva em conta o nome da classe de entidade usando o separador '.'.
 * Sem essa customização, a estratégia padrão pega o nome da classe até o primeiro ponto.
 */
export class CustomNamingStrategy extends UnderscoreNamingStrategy {
  override getClassName(file: string, separator?: string): string {
    const parts = file.split('.');
    parts.pop(); //remove las item

    //add upper case to each part
    for (let i = 0; i < parts.length; i++) parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].slice(1);

    const className = parts.join('');
    return className;
  }
}
