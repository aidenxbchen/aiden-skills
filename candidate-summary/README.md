# Candidate Summary Skill

An OpenClaw skill that generates candidate communication summaries in your personal writing style based on interview notes or audio transcriptions.

## Overview

This skill analyzes candidate information (from audio transcriptions, interview notes, or other sources) and generates professional communication summaries that match your established writing style. Based on your extensive examples of candidate evaluations, the skill produces summaries with:

- Consistent structure and formatting
- Professional yet personal tone
- Comprehensive candidate assessment
- Clear recommendations and next steps

## Features

- **Style Preservation**: Maintains your unique writing style learned from your existing summaries
- **Structured Output**: Follows your proven format for candidate evaluations  
- **Comprehensive Analysis**: Covers technical skills, motivation, personality traits, and cultural fit
- **Actionable Recommendations**: Provides clear interview guidance and decision rationale
- **Risk Assessment**: Identifies potential concerns or red flags when applicable

## Usage

### Prerequisites
- Audio transcription of candidate conversation OR written interview notes
- Candidate basic information (name, school, role/position)

### Input Format
Provide candidate information in any of these formats:
- Raw interview notes
- Audio transcription text  
- Structured candidate data

### Output Format
The skill generates summaries following your established pattern:

```
"Name-School Position/Role
Current status and background context.
Key motivations and career preferences.
Notable achievements or formative experiences.
Personality traits and working style observations.
[Optional: Risk considerations or concerns]
【Conclusion】: Clear recommendation with specific interview focus areas."
```

## Style Guidelines

Based on your examples, summaries should include:

### Structure Elements
1. **Header**: `姓名-学校 专业/职位`
2. **Current Status**: Academic/professional current situation
3. **Background Story**: Educational journey, competition experience, career decisions
4. **Motivation Analysis**: Why they're interested in startups/specific roles
5. **Key Events**: Most proud achievements, transformative experiences
6. **Character Assessment**: Communication skills, logical thinking, execution style
7. **Risk Notes**: Potential concerns (when applicable)
8. **Conclusion**: Clear recommendation + specific interview evaluation points

### Writing Style
- **Concise and direct**: Use short sentences, avoid unnecessary elaboration
- **Fact-based with judgment**: Combine objective facts with subjective assessment
- **Specific details**: Include concrete company names, competition names, technical specifics
- **Human-centered**: Consider family influence, personal values, emotional drivers
- **Professional terminology**: Use accurate technical terms (ROS, PCB, embedded systems, etc.)

## Examples

### Input Example
```
Candidate: Zhang Chaoran, Dalian Polytechnic University, Mechanical Structural Engineer
Currently seeking startup opportunities because feels limited for big companies like Yunjing, Stone, Kuma. 
Wants to work on practical problems rather than four-legged/humanoid robots without real applications.
Originally planned to take postgraduate exam at Taiyuan University but abandoned due to curriculum changes.
Most proud achievement: Beat Northeastern University Action team in provincial competition.
When asked about personal growth from achieving unexpected success, responded there was no significant change.
```

### Output Example  
```
"张超然-大连工业大学机械结构工程师 大厂（云鲸、石头、库犸）几乎没戏，想找个创业公司（主要是因为能力局限性，其次关注到四足、人形机器人没有落地场景，希望能做一些能解决实际问题的事情）。 原计划考研太原工业大学，因专业课更改，放弃。 最有成就感的事情是，在省赛打败东北大学 Action 团队，但是追问“做到了以为自己做不到的事情”给自己带来的改变，回答没有什么明显的体感。 【结论】：推荐面试，面试过程中重点考量其过去所做的实质性结构设计工作，各位评估其能否胜任我们的结构工程师岗位。"
```

## Installation

1. Place the skill files in your OpenClaw skills directory
2. Ensure the skill is properly referenced in your workspace
3. The skill will be automatically available when processing candidate-related requests

## Integration

This skill works seamlessly with:
- Audio transcription services (provide transcribed text as input)
- Interview note-taking workflows
- Candidate evaluation pipelines
- Recruitment communication processes

## Customization

To further refine the output style:
1. Provide additional example summaries
2. Specify preferred emphasis areas (technical vs. cultural fit vs. motivation)
3. Adjust conclusion templates based on role requirements

## License

MIT License - Feel free to adapt and extend for your recruitment workflow needs.

## Author

Generated and maintained by your OpenClaw assistant based on your established communication patterns.