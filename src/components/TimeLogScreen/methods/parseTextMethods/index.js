import { parseAllEntriesForExpenses } from './expensesMethods';
import { parseAllEntriesForFoodEntries } from './foodMethods';
import { parseAllEntriesForHabits } from './habitsMethods';

export const parseAllEntriesForRelevantData = (entries) => {
    // parseAllEntriesForExpenses(entries)
    let foodlogs = parseAllEntriesForFoodEntries(entries)
    let habits = parseAllEntriesForHabits(entries)

    let data = {
        habits,
        gratitude: {
            numberOfEntries: 3,
            formattedText: "(hardcoded) (3/3) 1. Grateful for the Alarmy app for having the Do Math component that helps get my brain working, and I don't have to drive all the way over to the sign to turn it off 2. Grateful for the instant coffee that helps warm me up in the morning 3. Grateful for the Chill Your Mind radio!"
        },
        foodlogs,
        // foodlogs: {
        //     numberOfEntries: 5,
        //     formattedText: '(hardcoded) x incomplete - 0 '
        // },
        expenses: {
            numberOfEntries: 2,
            formattedText: '(hardcoded) x incomplete - 0 spent today; 0 earned today'
        },
        learned: {
            numberOfEntries: 5,
            formattedText: '(hardcoded)(0/1)'
        },
        newpeople: {
            numberOfEntries: 4,
            formattedText: '(hardcoded)(0/1)'
        },
        igfollowers: {
            numberOfEntries: 1,
            formattedText: '(hardcoded)11.1k'
        },
        weight: {
            numberOfEntries: 2,
            formattedText: '(hardcoded)67 kg'
        },

    }


    return data
}