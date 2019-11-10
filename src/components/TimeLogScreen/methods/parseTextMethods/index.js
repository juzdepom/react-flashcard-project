import { parseAllEntriesFor } from './mainParsingMethod';
import { parseAllEntriesForHabits } from './habitsMethods';

export const parseAllEntriesForRelevantData = (entries) => {
    // parseAllEntriesForExpenses(entries)
    let foodlogs = parseAllEntriesFor(entries, 'f', 'f')
    let weight = parseAllEntriesFor(entries, 'w', 'w')
    let learned = parseAllEntriesFor(entries, 'l', 'l')
    let gratitude = parseAllEntriesFor(entries, 'g', 'g')

    let habits = parseAllEntriesForHabits(entries)

    let data = {
        habits,
        learned,
        weight,
        gratitude,
        foodlogs,
        expenses: {
            numberOfEntries: 2,
            formattedText: '(hardcoded) x incomplete - 0 spent today; 0 earned today'
        },
        newpeople: {
            numberOfEntries: 4,
            formattedText: '(hardcoded)(0/1)'
        },
        igfollowers: {
            numberOfEntries: 1,
            formattedText: '(hardcoded)11.1k'
        },
        

    }


    return data
}