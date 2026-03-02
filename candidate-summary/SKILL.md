# Candidate Summary Skill

## Purpose
Generate candidate communication summaries in the user's exact writing style based on audio transcription input.

## Style Guidelines (Based on User Examples)

### Structure Format:
1. **Header**: "姓名-学校-专业/职位" 
2. **Current Status**: Current situation (in school/internship/job hunting)
3. **Background Story**: Educational background, competition experience, career planning
4. **Motivation Analysis**: Why interested in startup companies, product understanding
5. **Key Events**: Most proud achievements, transformative experiences
6. **Personality Traits**: Communication skills, logical thinking, execution style
7. **Risk Assessment**: Potential concerns or red flags (if any)
8. **Conclusion**: Clear recommendation with specific interview focus areas

### Writing Style Characteristics:
- **Concise and direct**: Use short sentences, avoid lengthy descriptions
- **Objective with subjective judgment**: Mix factual statements with personal assessments  
- **Specific details**: Include actual company names, competition names, technical specifics
- **Human-centered**: Focus on candidate's inner thoughts, family influence, values
- **Professional terminology**: Use accurate technical terms (ROS, PCB, embedded systems, etc.)
- **Natural flow**: Write conversationally but professionally

### Key Evaluation Dimensions:
- **Technical capability**: Specific skills, project experience, foundational knowledge
- **Motivation alignment**: Why startup vs big company, product sense
- **Personality traits**: Communication ability, execution speed, stress tolerance  
- **Growth potential**: Learning ability, development trajectory, self-awareness
- **Cultural fit**: Team collaboration, work ethic, value alignment

### Example Patterns to Follow:
- "大厂（云鲸、石头、库犸）几乎没戏，想找个创业公司（主要是因为能力局限性...）"
- "最有成就感的事情是，在省赛打败东北大学 Action 团队..."
- "【结论】：推荐面试，面试过程中重点考量其过去所做的实质性结构设计工作..."
- "【风险提示】在交流过程中，有一些感受是逻辑能力不强，表达能力中等..."

## Usage Instructions

When user provides audio transcription of candidate conversation:

1. **Parse the transcription** to extract key information
2. **Apply the style guidelines** above to structure the summary
3. **Maintain the exact tone and format** from user examples
4. **Include all relevant dimensions**: technical, motivational, personality, risks
5. **End with clear conclusion** and specific interview recommendations
6. **Send the formatted summary** back to user automatically

## Output Format
Always output in Chinese, following the exact structure and style demonstrated in the provided examples. Use 【结论】and 【风险提示】markers when appropriate.