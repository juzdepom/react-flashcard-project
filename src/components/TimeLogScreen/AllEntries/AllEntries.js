import React from 'react';
import './AllEntries.scss';
import {
    convertMinutesToHoursAndMinutes,
    returnBackgroundTypeBasedOnHashtag,
    turnTimeLogStringArrayIntoArrayOfDict,
    parseEntryDataArrayIntoHashtagArray,
    formatDate,
} from '../methods/methods';

class Entry extends React.Component {
    constructor(props){
        super(props)
    }

    parseRawTextForHashtagData = (rawText) => {
        if(rawText == undefined){ return [] }
        let arrayOfStrings = rawText.split('\n')
        let entryData = turnTimeLogStringArrayIntoArrayOfDict(arrayOfStrings)
        let hashtagData = parseEntryDataArrayIntoHashtagArray(entryData)
        return hashtagData
    }

    returnFormattedHashtagData = (hashtagData) => {
        var formattedHashtagData = ''
        if(hashtagData.length === 0){
            return formattedHashtagData
        }

        formattedHashtagData = hashtagData.map((item, i) => {
            let hashtag = item["hashtag"]
            let time = convertMinutesToHoursAndMinutes(item["time"])
            let backgroundType = returnBackgroundTypeBasedOnHashtag(hashtag)
            let className = "bg-"+backgroundType
            return(
                <div className={className}>{hashtag}: {time}</div>
            )
            
        })
        return formattedHashtagData;
    }

    render(props){
        let date = formatDate(this.props.day["date"])
        let details = "5:33 AM - 8 PM (7h30)"
        let hashtagData = this.parseRawTextForHashtagData(this.props.day["rawEntry"])
        let hashtags = this.returnFormattedHashtagData(hashtagData)
        return (
            <div className="allEntries--entry">
                {date}
                <br/>
                {details}
                {hashtags}
            </div>
        )
    }

}

class AllEntries extends React.Component {
    constructor(props){
        super(props)
    }

    renderEntries = () => {
        return this.props.allEntries.map((item, index) => {
            return <Entry day={item}/>
        });
        

    }

    render(props) {
        return (
            <div className="allEntries">
                {this.renderEntries()}
            </div>
        );
    }
}

export default AllEntries;