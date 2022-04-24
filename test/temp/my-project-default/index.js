import arrayUnique from 'array-uniq';
import process from 'node:process';

process.stdout.write(arrayUnique([1, 2, 2]).toString());
