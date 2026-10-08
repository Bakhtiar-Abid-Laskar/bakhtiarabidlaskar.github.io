import React from 'react';
import profile from '@/content/profile';
import styles from './EducationSkills.module.css';

export const EducationSkills: React.FC = () => {
  return (
    <section
      id="education-skills"
      className={styles.section}
      aria-labelledby="education-skills-title"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="education-skills-title" className={styles.sectionTitle}>
            Education and skills
          </h2>
          <p className={styles.leadText}>
            Academic background and technical proficiency across modern software engineering.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Education Column */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Education</h3>
            <div className={styles.educationList} role="list">
              {profile.education.map((item, index) => (
                <div key={index} className={styles.educationCard} role="listitem">
                  <div className={styles.educationHeader}>
                    <h4 className={styles.degreeTitle}>{item.degree}</h4>
                    <span className={styles.periodBadge}>{item.period}</span>
                  </div>
                  <p className={styles.institutionName}>{item.institution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Column */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Skills</h3>
            <div className={styles.skillsGroups}>
              {profile.skills.map((group) => (
                <div key={group.category} className={styles.skillGroup}>
                  <h4 className={styles.categoryTitle}>{group.category}</h4>
                  <ul className={styles.tagsList} aria-label={`${group.category} skills`}>
                    {group.items.map((skill) => (
                      <li key={skill} className={styles.skillTag}>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSkills;
