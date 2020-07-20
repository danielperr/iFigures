import React from 'react';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { ElementLabel } from './ElementLabel';
import { ElementImage } from "./ElementImage";
import { ElementYoutube } from "./ElementYoutube";
import { ElementSingleLineTextInput } from "./ElementSingleLineTextInput";
import { ElementMultiLineTextInput } from "./ElementMultiLineTextInput";
import { ElementMultiChoice } from "./ElementMultiChoice";
import { SectionHeader } from "./SectionHeader";
import { ElementMathInput } from './ElementMathInput';


const useStyles = makeStyles((theme) => ({
  sectionPaper: {
    margin: theme.spacing(2),
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));


export function Section(props) {
  const classes = useStyles();
  const [answers, setAnswers] = React.useState({});

  let checkablesAmount = 0;
  let correctQuestions = new Set();

  const handleAnswer = (questionId, answer) => {
    answers[questionId] = answer;
    props.onAnswer(answers);
  };

  const elements = [];
  props.elements.forEach((element) => {
    let obj;
    const answer = props.answers[element.id] || "";
    switch (element.type) {
      case 'label':
        obj = <ElementLabel text={element.text}
          id={element.id}
          key={element.id} />;
        break;

      case 'image':
        obj = <ElementImage src={element.src}
          id={element.id}
          key={element.id} />;
        break;

      case 'youtube':
        obj = <ElementYoutube youtubeId={element.youtubeId}
          id={element.id}
          key={element.id} />;
        break;

      case 'single-line-text-input':
        obj = <ElementSingleLineTextInput text={element.text}
          answer={answer}
          onAnswer={handleAnswer}
          id={element.id}
          key={element.id} />;
        break;

      case 'multi-line-text-input':
        obj = <ElementMultiLineTextInput text={element.text}
          answer={answer}
          onAnswer={handleAnswer}
          id={element.id}
          key={element.id} />;
        break;

      case 'multi-choice':
        checkablesAmount++;

        const questionId = element.id;
        if (answer !== "") {
          answers[questionId] = answer;
        }

        if (questionId in answers) {
          const correctIds = element.correct.map(answer => {
            return answer.id;
          });

          if (correctIds.includes(answer)) {
            correctQuestions.add(questionId);
          }
        }

        obj = <ElementMultiChoice
          text={element.text}
          correct={element.correct}
          incorrect={element.incorrect}
          answer={answer}
          onAnswer={handleAnswer}
          id={element.id}
          key={element.id}
        />;
        break;

      default:
        obj = <label>{"אלמנט לא מזוהה"}</label>;
    }
    elements.push(<div className="element"
      id={element.id}
      key={element.id + "-D"}>
      {obj}
      <br />
    </div>);
  });

  return (<Paper elevation={5} className={classes.sectionPaper}>
    <SectionHeader text={props.header}
      name={props.id + "-H"} />
    <div className="section-elements"
      key={props.id + "-D"}>
      {elements}
    </div>
    {checkablesAmount > 0 &&
      <button>
        בדוק תשובות עבור מקטע זה שאם אתה טועה אכלתה קאשה
                    </button>
    }
    {checkablesAmount === correctQuestions.size &&
      <h2> Good Job </h2>
    }
  </Paper>);
}
