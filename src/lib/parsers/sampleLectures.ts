// ==============================================================================
// NURSING STUDY AI — SAMPLE NURSING LECTURES DATA
// محاضرات تمريض نموذجية غنية بالمحتوى الطبي والترجمة والأسئلة لطلاب التمريض
// ==============================================================================

import { Lecture } from '@/types';

export const SAMPLE_SHOCK_LECTURE: Lecture = {
  id: 'lecture_shock_001',
  title: 'Types of Shock & Critical Care Nursing Management',
  subject: 'Critical Care Nursing (تمريض الحالات الحرجة)',
  slideCount: 6,
  status: 'completed',
  progress: 100,
  currentStepMessage: 'جاهزة للدراسة والمراجعة والاختبار',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sourceFileName: 'Types_Of_Shock_Critical_Care.pptx',
  fileSize: 2450000,
  fileType: 'pptx',
  privacy: 'public',
  shareId: 'shock-cc-2026',
  isBookmarked: true,
  slides: [
    {
      id: 'slide_001',
      lectureId: 'lecture_shock_001',
      slideNumber: 1,
      title: 'Definition of Shock & Pathophysiology',
      originalEnglish:
        'Shock is a life-threatening physiological condition characterized by inadequate tissue perfusion and cellular hypoxia. This leads to cellular dysfunction, anaerobic metabolism, and systemic organ failure if left uncorrected.',
      arabicTranslation:
        'الصدمة هي حالة فسيولوجية مهددة للحياة تتميز بعدم كفاية التروية الدموية للأنسجة ونقص الأكسجة الخلوية. يؤدي ذلك إلى اختلال وظيفي خلوي، وأيض لا هوائي، وفشل جهازي في الأعضاء إذا لم يتم تصحيحها سريعاً.',
      bullets: [
        {
          en: 'Imbalance between oxygen supply and cellular metabolic demand.',
          ar: 'اختلال التوازن بين إمداد الأكسجين واحتياج الخلايا الأيضي.',
        },
        {
          en: 'Shift from aerobic metabolism to anaerobic metabolism producing lactic acid.',
          ar: 'التحول من الأيض الهوائي إلى الأيض اللاهوائي مما يُنتج حمض اللاكتيك (حموضة الدم).',
        },
        {
          en: 'Mean Arterial Pressure (MAP) drops below 65 mmHg in decompensated stages.',
          ar: 'انخفاض متوسط الضغط الشرياني (MAP) إلى أقل من 65 ملم زئبق في المراحل غير المعوضة.',
        },
      ],
      verification: {
        requiresVerification: false,
      },
      examFocus: [
        {
          category: 'definition',
          categoryLabelAr: 'تعريف أساسي',
          pointsEn: ['Inadequate tissue perfusion resulting in cellular hypoxia and anaerobic metabolism.'],
          pointsAr: ['قصور التروية الدموية للأنسجة المؤدي لنقص الأكسجة الخلوية والتحول للأيض اللاهوائي.'],
        },
        {
          category: 'signs_symptoms',
          categoryLabelAr: 'علامات تشخيصية هامة',
          pointsEn: ['Lactic acidosis (Serum lactate > 2 mmol/L), Decreased MAP (< 65 mmHg)'],
          pointsAr: ['ارتفاع حمض اللاكتيك بالدم (> 2 ملليمول/لتر)، وهبوط متوسط الضغط الشرياني (< 65)'],
        },
      ],
      explanation: {
        simpleEnglish:
          'Think of shock as a plumbing problem. The body cells are not receiving enough blood and oxygen. Without oxygen, cells switch to emergency mode, produce lactic acid, and will eventually die if blood flow is not restored immediately.',
        arabic:
          'الصدمة ببساطة ليست مجرد هبوط ضغط، بل هي فشل في وصول الدم المؤكسج للخلايا الحيوية (المخ، الكلى، القلب). عندما تحرم الخلايا من الأكسجين، تحرق الجلوكوز بدون أكسجين وتفرز حمض اللاكتيك الذي يدمر الأعضاء.',
        egyptianArabic:
          'بمعنى مبسط يا زمايلنا، الصدمة مش مجرد إن الضغط واطي وخلاص! الصدمة معناها إن الدم والأكسجين مش واصلين لخلايا الجسم كويس (poor perfusion). الخلية لما تتخنق من قلة الأكسجين، بتضطر تشتغل لا هوائي وتطلع حمض اللاكتيك، وده بيعمل حموضة في الدم وتسمم للأعضاء لو ملحقناش العيان بمحاليل وأدوية رافعة للضغط.',
      },
      terms: [
        {
          id: 'term_001',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 1,
          english: 'Tissue Perfusion',
          arabic: 'التروية النسيجية',
          ipa: '/ˈtɪʃuː pərˈfjuːʒən/',
          definitionEn: 'The passage of fluid (such as blood) through the circulatory system to an organ or a tissue.',
          definitionAr: 'مرور وتدفق الدم المحمل بالأكسجين والمغذيات عبر الشعيرات الدموية لتغذية أنسجة الجسم.',
          relatedTerms: ['Microcirculation', 'Hypoxia', 'Ischemia'],
          isBookmarked: true,
        },
        {
          id: 'term_002',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 1,
          english: 'Cellular Hypoxia',
          arabic: 'نقص الأكسجة الخلوية',
          ipa: '/ˈsɛljʊlər haɪˈpɑːksiə/',
          definitionEn: 'A state in which cells are deprived of adequate oxygen supply at the microscopic level.',
          definitionAr: 'حالة حرمان خلايا الجسم من الإمداد الكافي من غاز الأكسجين الضروري لإنتاج الطاقة.',
          relatedTerms: ['Hypoxemia', 'Cyanosis', 'Anaerobic Metabolism'],
          isBookmarked: false,
        },
        {
          id: 'term_003',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 1,
          english: 'Anaerobic Metabolism',
          arabic: 'الأيض اللاهوائي',
          ipa: '/ˌæn.əˈroʊ.bɪk məˈtæb.ə.lɪ.zəm/',
          definitionEn: 'The creation of energy through the combustion of carbohydrates in the absence of oxygen, yielding lactic acid.',
          definitionAr: 'توليد الطاقة الخلوية في غياب الأكسجين، مما يؤدي لتراكم حمض اللاكتيك وحدوث حماض أيضي.',
          relatedTerms: ['Lactate', 'Metabolic Acidosis', 'ATP'],
          isBookmarked: false,
        },
      ],
    },
    {
      id: 'slide_002',
      lectureId: 'lecture_shock_001',
      slideNumber: 2,
      title: 'Classification of Shock (Four Main Types)',
      originalEnglish:
        'Shock is clinically classified into four primary categories based on underlying etiology: 1. Hypovolemic Shock, 2. Cardiogenic Shock, 3. Obstructive Shock, 4. Distributive Shock (Septic, Anaphylactic, and Neurogenic).',
      arabicTranslation:
        'تُصنّف الصدمة إكلينيكياً إلى أربع فئات رئيسية بناءً على المسبب المباشر: 1. صدمة نقص حجم الدم (Hypovolemic)، 2. صدمة قلبية المنشأ (Cardiogenic)، 3. صدمة انسدادية (Obstructive)، 4. صدمة توزيعية (Distributive وتشمل الإنتانية، التحسسية، والعصبية).',
      bullets: [
        {
          en: 'Hypovolemic: Loss of intravascular fluid volume (hemorrhage, severe dehydration, third spacing).',
          ar: 'نقص حجم الدم: فقدان السوائل داخل الأوعية (نزيف حاد، جفاف شديد، حروق واسعة).',
        },
        {
          en: 'Cardiogenic: Failure of the heart pump (acute myocardial infarction, severe arrhythmias).',
          ar: 'قلبية: فشل عضلة القلب كمضخة (جلطة القلب الحادة، اضطراب النبض الخطير).',
        },
        {
          en: 'Obstructive: Physical mechanical blockage of blood flow (pulmonary embolism, cardiac tamponade, tension pneumothorax).',
          ar: 'انسدادية: انسداد ميكانيكي لتدفق الدم (جلطة الرئة، الارتشاح التاموري حول القلب، استرواح الصدر الضاغط).',
        },
        {
          en: 'Distributive: Excessive vasodilation with normal volume (sepsis, anaphylaxis, spinal cord injury).',
          ar: 'توزيعية: اتساع وعائي مفرط وغير منضبط مع ثبات حجم السوائل (تسمم دموي، حساسية مفرطة، صدمة عصبية).',
        },
      ],
      verification: {
        requiresVerification: false,
      },
      examFocus: [
        {
          category: 'classification',
          categoryLabelAr: 'تصنيف إكلينيكي هام',
          pointsEn: ['Four types: Hypovolemic, Cardiogenic, Obstructive, Distributive.'],
          pointsAr: ['الأنواع الأربعة: نقص السوائل، قلبية، انسدادية، وتوزيعية.'],
        },
      ],
      explanation: {
        simpleEnglish:
          'Remember the 4 Ps: Pump failure (Cardiogenic), Pipes leaking/too wide (Distributive), Pipe blocked (Obstructive), or not enough Puddle/fluid (Hypovolemic).',
        arabic:
          'تخيل الدورة الدموية مثل شبكة مياه: إما المضخة عطلانة (قلبية)، أو الأنابيب اتسعت جداً فجأة (توزيعية)، أو الأنبوب مسدود بحصوة (انسدادية)، أو خزان المياه نفسه فضي بالنزيف (نقص حجم الدم).',
        egyptianArabic:
          'سكمها يا دكتور في دماغك كدة: الدورة الدموية شبكة سباكة؛ يا إما الموتور عطلان (Cardiogenic)، يا إما الخزان فضي ونزف (Hypovolemic)، يا إما الخرطوم اتسد بجلطة (Obstructive)، يا إما الخراطيم وسعت أوي والضغط هرب (Distributive زي السيبسيس والحساسية).',
      },
      terms: [
        {
          id: 'term_004',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 2,
          english: 'Hypovolemic Shock',
          arabic: 'صدمة نقص حجم الدم',
          ipa: '/ˌhaɪ.poʊ.voʊˈliː.mɪk ʃɑːk/',
          definitionEn: 'Shock caused by critical loss of blood or fluid volume (>15-20% of total volume).',
          definitionAr: 'صدمة ناتجة عن فقدان حاد في حجم الدم أو سوائل الجسم يتجاوز 15-20% من الحجم الكلي.',
          relatedTerms: ['Hemorrhage', 'Dehydration', 'CVP'],
          isBookmarked: true,
        },
        {
          id: 'term_005',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 2,
          english: 'Cardiac Tamponade',
          arabic: 'الاندحاس القلبي / الارتشاح التاموري الضاغط',
          ipa: '/ˈkɑːr.di.æk ˌtæm.pəˈneɪd/',
          definitionEn: 'Compression of the heart caused by fluid accumulation in the pericardial sac.',
          definitionAr: 'انضغاط حاد لعضلة القلب بسبب تجمع السوائل أو الدم داخل كيس التامور المحيط به، مانعاً امتلاء البطينين.',
          relatedTerms: ['Beck Triad', 'Pulsus Paradoxus', 'Pericardiocentesis'],
          isBookmarked: false,
        },
      ],
    },
    {
      id: 'slide_003',
      lectureId: 'lecture_shock_001',
      slideNumber: 3,
      title: 'Stages of Shock: Compensatory vs Decompensated',
      originalEnglish:
        'Shock progresses through three sequential clinical stages: 1. Initial / Compensatory Stage: Blood pressure is maintained within normal range through sympathetic stimulation (tachycardia, peripheral vasoconstriction). 2. Progressive (Decompensated) Stage: Compensatory mechanisms fail, MAP drops, oliguria ensues. 3. Irreversible (Refractory) Stage: Extensive cellular death and MODS occur; recovery is impossible.',
      arabicTranslation:
        'تتطور الصدمة عبر ثلاث مراحل سريرية متتالية: 1. المرحلة التعويضية الأولية: يتم الحفاظ على ضغط الدم ضمن المعدل الطبيعي عبر تنشيط الجهاز السمبثاوي (تسارع ضربات القلب وانقباض الأوعية الطرفية). 2. المرحلة المتقدمة (غير المعوضة): تفشل آليات التعويض، ويهبط متوسط الضغط الشرياني، ويحدث شح البول (Oliguria). 3. المرحلة المستعصية (غير الرجعية): يحدث موت خلوي واسع ومتلازمة فشل الأعضاء المتعدد (MODS)؛ ويستحيل الشفاء.',
      bullets: [
        {
          en: 'Compensatory Stage: Normal BP, HR > 100 bpm, cool pale skin, respiratory rate elevated.',
          ar: 'المرحلة التعويضية: ضغط الدم طبيعي، النبض متسارع (> 100)، الجلد شاحب وبارد، زيادة معدل التنفس.',
        },
        {
          en: 'Progressive Stage: Systolic BP < 90 mmHg, HR > 120 bpm, urine output < 0.5 mL/kg/hr, lethargy.',
          ar: 'المرحلة المتقدمة: الضغط الانقباضي أقل من 90، النبض > 120، إدرار البول أقل من 0.5 مل/كجم/ساعة، خمول واضطراب الوعي.',
        },
        {
          en: 'Refractory Stage: Severe profound refractory hypotension, anuria, coma, multi-organ failure.',
          ar: 'المرحلة المستعصية: هبوط ضغط عنيف لا يستجيب للعلاجات، انقطاع البول، غيبوبة، وفشل متعدد للأعضاء.',
        },
      ],
      verification: {
        requiresVerification: false,
      },
      examFocus: [
        {
          category: 'signs_symptoms',
          categoryLabelAr: 'فروق هامة جداً للامتحان',
          pointsEn: [
            'In Compensatory stage: BP is STILL NORMAL! Tachycardia is the earliest indicator.',
            'Oliguria (< 30 mL/hr or < 0.5 mL/kg/hr) indicates organ hypoperfusion in Progressive stage.',
          ],
          pointsAr: [
            'في المرحلة التعويضية: الضغط يكون طبيعياً! تسارع النبض هو أول وأبكر علامة إنذار.',
            'شح البول (أقل من 30 مل/ساعة) يعكس قصور تروية الكلى بالمرحلة المتقدمة.',
          ],
        },
      ],
      explanation: {
        simpleEnglish:
          'In stage 1, your body is fighting back hard to keep BP normal by beating the heart faster. When the body gets tired in stage 2, BP drops and organs begin to shut down. In stage 3, organ damage is permanent.',
        arabic:
          'الجسم في البداية يحاول إنقاذ نفسه عبر إفراز الأدرينالين، فيزيد نبض القلب ليحافظ على ضغط طبيعي. الخطأ الشائع هو انتظار هبوط الضغط؛ فعندما يهبط الضغط نكون دخلنا المرحلة المتقدمة الخطيرة.',
        egyptianArabic:
          'سؤال مشهور في امتحانات الشفوي والنظري: هل معنى إن ضغط العيان 120/80 إنه مش في صدمة؟ لأ طبعاً! العيان في المرحلة التعويضية (Compensatory) جسمه معوّض بالنبض السريع (Tachycardia) وانقباض الأوعية. لما النبض يعدي 100 والجلد يسقع، اعرف إنه بيبدأ شوك حتى لو الضغط لسه ماسك نفسه!',
      },
      terms: [
        {
          id: 'term_006',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 3,
          english: 'Oliguria',
          arabic: 'شح البول / قلة إدرار البول',
          ipa: '/ˌɑː.lɪˈɡjʊr.i.ə/',
          definitionEn: 'Abnormally small production of urine (< 400 mL/day or < 0.5 mL/kg/hr in adults).',
          definitionAr: 'انخفاض غير طبيعي في حجم البول المطروح (أقل من 0.5 مل لكل كجم من وزن الجسم بالساعة).',
          relatedTerms: ['Anuria', 'Acute Kidney Injury', 'Creatinine'],
          isBookmarked: true,
        },
        {
          id: 'term_007',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 3,
          english: 'MODS (Multiple Organ Dysfunction Syndrome)',
          arabic: 'متلازمة الخلل الوظيفي المتعدد للأعضاء',
          ipa: '/mɒdz/',
          definitionEn: 'Altered organ function in an acutely ill patient requiring medical intervention to achieve homeostasis.',
          definitionAr: 'فشل حاد متزامن في وظائف عضوين أو أكثر في المريض الحرج يستدعي تدخلاً مكثفاً للبقاء حياً.',
          relatedTerms: ['SIRS', 'Sepsis', 'DIC'],
          isBookmarked: false,
        },
      ],
    },
    {
      id: 'slide_004',
      lectureId: 'lecture_shock_001',
      slideNumber: 4,
      title: 'Priority Nursing Interventions in Shock',
      originalEnglish:
        'Immediate nursing interventions focus on optimizing oxygen delivery and restoring intravascular volume: 1. Airway and High-Flow Oxygen administration (SpO2 target > 94%). 2. Rapid fluid resuscitation via two large-bore peripheral IV lines (14G or 16G) using isotonic crystalloids (0.9% Normal Saline or Ringer Lactate). 3. Modified Trendelenburg positioning (elevate lower extremities 20 degrees; avoid full Trendelenburg). 4. Strict hourly urine output monitoring via Foley catheter.',
      arabicTranslation:
        'تركز التدخلات التمريضية العاجلة على تعزيز وصول الأكسجين واستعادة حجم السوائل الوعائية: 1. تأمين مجرى الهواء وإعطاء أكسجين عالي التدفق (الهدف SpO2 > 94%). 2. إنعاش سريع بالسوائل عبر قسطرتين وريديتين طرفيتين واسعتين (مقاس 14G أو 16G) باستخدام محاليل بلورية متساوية التوتر (محلول ملح 0.9% أو رينجر لاكتات). 3. وضعية ترندلنبورغ المعدلة (رفع الساقين 20 درجة مع إبقاء الجذع مستوياً؛ وتجنب وضع ترندلنبورغ الكامل). 4. مراقبة دقيقة لإدرار البول بالساعة عبر قسطرة فولي البولية.',
      bullets: [
        {
          en: 'Insert two large-bore IV cannulas (14 or 16 gauge) immediately.',
          ar: 'تركيب كانيولتين وريديتين كبيرتي القطر (مقاس 14 أو 16 البرتقالية أو الرمادية) فوراً.',
        },
        {
          en: 'Administer isotonic crystalloids; warm fluids to prevent hypothermia.',
          ar: 'إعطاء محاليل بلورية متساوية التوتر دافئة لمنع هبوط درجة حرارة الجسم.',
        },
        {
          en: 'Modified Trendelenburg: Legs elevated 20 degrees with trunk flat to facilitate venous return.',
          ar: 'وضعية ترندلنبورغ المعدلة: رفع الأرجل 20 درجة مع بقاء الصدر أفقياً لتحسين العائد الوريدي دون ضغط الحجاب الحاجز.',
        },
        {
          en: 'Target urine output: At least 0.5 mL/kg/hour (approx. 30–50 mL/hr).',
          ar: 'المعدل المستهدف لإدرار البول: 0.5 مل/كجم/ساعة على الأقل (حوالي 30-50 مل بالساعة).',
        },
      ],
      verification: {
        requiresVerification: false,
      },
      examFocus: [
        {
          category: 'nursing_interventions',
          categoryLabelAr: 'تدخلات تمريضية حرجة',
          pointsEn: [
            'Two large-bore IVs (14G or 16G) — never small lines for shock resuscitation!',
            'Modified Trendelenburg (legs up 20 degrees) — NOT full Trendelenburg which impairs respiration.',
            'Hourly urine output is the single best indicator of vital organ perfusion.',
          ],
          pointsAr: [
            'كانيولتان واسعتان (14G أو 16G) — إياك استخدام كانيولا زرقاء أو وردية صغيرة في الإنعاش!',
            'ترندلنبورغ المعدل (رفع الساقين فقط 20 درجة) — وليس الكامل الذي يعيق حركة الرئتين.',
            'حساب كمية البول بالساعة هو المؤشر الذهبي لنجاح تروية الكلى والأعضاء.',
          ],
        },
      ],
      explanation: {
        simpleEnglish:
          'First, give oxygen. Second, open two big IV lines (grey or orange) to pour fluids fast. Third, lift the legs 20 degrees to send blood from the legs back to the heart. Fourth, insert a catheter and measure urine every single hour.',
        arabic:
          'الأولوية التمريضية الأولى هي الأكسجين، ثم تركيب كانيولات كبيرة جداً لضخ المحاليل بسرعة، ورفع رجلين المريض 20 درجة لمساعدة الدم يرجع للقلب، وتركيب قسطرة بول لمتابعة كمية البول كل ساعة كدليل على نجاة الكلى.',
        egyptianArabic:
          'في قسم الطوارئ والعناية: أول ما يجيلك عيان Shock، خطواتك محفوظة: ماسك أكسجين فوراً، كانيولتين كبار (16 رمادي أو 14 برتقالي) عشان تفتح محاليل رينجر بسرعة، وترفع رجليه لفوق 20 درجة (Modified Trendelenburg) عشان ترجع الدم للقلب والمخ، وتركب قسطرة فولي وتحسب البول بالساعة بالمسطرة!',
      },
      terms: [
        {
          id: 'term_008',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 4,
          english: 'Fluid Resuscitation',
          arabic: 'الإنعاش بالسوائل الوريدية',
          ipa: '/ˈfluːɪd rɪˌsʌsɪˈteɪʃən/',
          definitionEn: 'The medical practice of replenishing bodily fluids lost through sweating, bleeding, or dehydration.',
          definitionAr: 'إعطاء كميات محسوبة وسريعة من السوائل المعقمة بالوريد لاستعادة حجم الدم الشرياني الفعال.',
          relatedTerms: ['Crystalloids', 'Colloids', 'Bolus'],
          isBookmarked: true,
        },
        {
          id: 'term_009',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 4,
          english: 'Modified Trendelenburg',
          arabic: 'وضعية ترندلنبورغ المعدلة',
          ipa: '/ˈmɒdɪfaɪd trɛnˈdɛlənbɜːrɡ/',
          definitionEn: 'Patient lies supine with lower extremities elevated 20 degrees while trunk remains horizontal.',
          definitionAr: 'استلقاء المريض على ظهره أفقياً مع رفع الساقين للأعلى بزاوية 20 درجة لتعزيز التروية الدماغية والقلبية.',
          relatedTerms: ['Venous Return', 'Preload', 'Postural Hypotension'],
          isBookmarked: false,
        },
      ],
    },
    {
      id: 'slide_005',
      lectureId: 'lecture_shock_001',
      slideNumber: 5,
      title: 'Pharmacological Management: Vasoactive & Inotropic Medications',
      originalEnglish:
        'When fluid resuscitation fails to restore adequate MAP (target >= 65 mmHg), vasoactive medications are initiated via a central venous catheter: 1. Norepinephrine (Levophed): First-line vasopressor for septic and distributive shock to restore vascular tone. 2. Epinephrine: First-line for anaphylactic shock (IM injection 0.3-0.5 mg 1:1000). 3. Dobutamine: Inotropic agent for cardiogenic shock to enhance myocardial contractility. 4. Dopamine: Second-line alternative depending on dosage titrations.',
      arabicTranslation:
        'عندما يفشل الإنعاش بالسوائل في استعادة متوسط ضغط شرياني كافٍ (الهدف MAP >= 65 ملم زئبق)، يتم بدء الأدوية الفعالة وعائياً عبر قسطرة وريد مركزي (CVC): 1. نورإبينفرين (نورأدرينالين): الدواء الرافع للضغط الأول في الصدمة الإنتانية والتوزيعية لاستعادة قوة الأوعية. 2. إبينفرين (أدرينالين): دواء الخط الأول الحاسم للصدمة التحسسية (حقن عضلي 0.3-0.5 مجم بتركيز 1:1000). 3. دوبيوتامين: مقوي لعضلة القلب في الصدمة القلبية لتحسين الانقباض القلبي. 4. دوبامين: خيار بديل حسب معايرة الجرعات.',
      bullets: [
        {
          en: 'Norepinephrine: First-line vasopressor for Septic Shock.',
          ar: 'نورإبينفرين: رافع الضغط الأول المعتمد في الصدمة الإنتانية وتسمم الدم.',
        },
        {
          en: 'Epinephrine IM: First-line drug for Anaphylaxis (anterolateral thigh).',
          ar: 'إبينفرين بالعضل: العلاج الأول المنقذ للحياة في الحساسية المفرطة (منتصف الفخذ خارجياً).',
        },
        {
          en: 'Dobutamine: Enhances myocardial contractility without excessive tachycardia.',
          ar: 'دوبيوتامين: يزيد قوة انقباض عضلة القلب دون تسريع مفرط في ضربات القلب.',
        },
        {
          en: 'Nursing alert: Administer vasopressors via Central Venous Line to avoid peripheral extravasation necrosis.',
          ar: 'تنبيه تمريضي حرج: تُعطى رافعات الضغط عبر قسطرة وريد مركزي (CVC) لتجنب حدوث تسرب وتنخر الأنسجة الطرفية.',
        },
      ],
      verification: {
        requiresVerification: false,
      },
      examFocus: [
        {
          category: 'contraindications',
          categoryLabelAr: 'تنبيهات وموانع تمريضية حرجة',
          pointsEn: [
            'Never infuse concentrated Norepinephrine in a tiny peripheral vein due to severe extravasation gangrene risk.',
            'Anaphylactic shock drug of choice is ALWAYS Epinephrine IM, NOT antihistamines or corticosteroids alone.',
          ],
          pointsAr: [
            'ممنوع حقن النورأدرينالين المركز في وريد طرفي صغير لتجنب تسرب الدواء وموت الأنسجة (Extravasation necrosis).',
            'دواء الاختيار الأول في الصدمة التحسسية هو الأدرينالين بالعضل فوراً، وليس مضادات الهيستامين أو الكورتيزون فقط.',
          ],
        },
      ],
      explanation: {
        simpleEnglish:
          'If water (fluids) does not fix the low pressure, we need medicines to squeeze the pipes (vasopressors like Norepinephrine) or kick the pump harder (inotropes like Dobutamine). For severe allergies, Epinephrine IM is the instant life-saver.',
        arabic:
          'إذا ملأنا الأوعية بالسوائل وظل الضغط منخفضاً، نستخدم أدوية قابضة للأوعية لرفع الضغط (مثل النورأدرينالين)، أو مقويات للقلب (مثل الدوبيوتامين). وفي الحساسية القاتلة، الأدرينالين بالعضل هو الإنقاذ الفوري.',
        egyptianArabic:
          'لو ادينا محاليل والضغط لسه واقع تحت 65، بنلجأ لمقويات الأوعية (Vasopressors) زي النورأدرينالين عشان يضيّق الشرايين ويرفع الضغط، وبنركبه على سرنجة كهربائية وفي وريد مركزي (Central Line) عشان لو سرب في وريد طرفي هيموّت الجلد والأنسجة. وفي صدمة الحساسية (Anaphylaxis)، الحقنة المنقذة هي الأدرينالين في العضل (IM) في الفخذ فوراً!',
      },
      terms: [
        {
          id: 'term_010',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 5,
          english: 'Vasopressor',
          arabic: 'قابض للأوعية الدموية / رافع للضغط',
          ipa: '/ˌveɪzoʊˈprɛsər/',
          definitionEn: 'A medication that constricts blood vessels, increasing systemic vascular resistance and blood pressure.',
          definitionAr: 'دواء يسبب انقباضاً وتضيقاً في الأوعية الدموية مما يؤدي لرفع المقاومة الوعائية وضغط الدم.',
          relatedTerms: ['Norepinephrine', 'Extravasation', 'SVR'],
          isBookmarked: true,
        },
        {
          id: 'term_011',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 5,
          english: 'Inotropic Agent',
          arabic: 'معدل قوة الانقباض القلبي',
          ipa: '/ˌaɪnəˈtrɒpɪk ˈeɪdʒənt/',
          definitionEn: 'An agent that alters the force or energy of muscular contractions, particularly myocardial contractility.',
          definitionAr: 'عقار يؤثر مباشرة على قوة وكفاءة انقباض عضلة القلب (إيجابياً لزيادة قوة الضخ).',
          relatedTerms: ['Dobutamine', 'Ejection Fraction', 'Cardiac Output'],
          isBookmarked: false,
        },
      ],
    },
    {
      id: 'slide_006',
      lectureId: 'lecture_shock_001',
      slideNumber: 6,
      title: 'Complications & Evaluation of Shock Management',
      originalEnglish:
        'Successful resuscitation is evaluated by clinical endpoints: 1. MAP maintained >= 65 mmHg. 2. Urine output >= 0.5 mL/kg/hour. 3. Normalizing serum lactate levels (< 2 mmol/L). 4. Capillary refill time < 2 seconds. Severe complications include: Acute Respiratory Distress Syndrome (ARDS), Acute Tubular Necrosis (ATN / renal failure), Disseminated Intravascular Coagulation (DIC), and death.',
      arabicTranslation:
        'يتم تقييم نجاح الإنعاش بناءً على معايير سريرية محددة: 1. الحفاظ على متوسط الضغط الشرياني MAP >= 65 ملم زئبق. 2. إدرار البول >= 0.5 مل/كجم/ساعة. 3. عودة حمض اللاكتيك بالدم لمعدله الطبيعي (< 2 ملليمول/لتر). 4. زمن امتلاء الشعيرات الدموية أقل من ثانيتين. وتشمل المضاعفات الخطيرة: متلازمة الضائقة التنفسية الحادة (ARDS)، النخر الأنبوبي الكلوي الحاد (فشل كلوي ATN)، التخثر المنتشر داخل الأوعية (DIC)، والوفاة.',
      bullets: [
        {
          en: 'Serum lactate clearance is a key indicator of resolving cellular hypoxia.',
          ar: 'انخفاض وتلاشي حمض اللاكتيك هو الدليل المخبري الأقوى على انتهاء نقص الأكسجة الخلوية.',
        },
        {
          en: 'Capillary refill time < 2 seconds indicates restored microcirculatory perfusion.',
          ar: 'زمن امتلاء الشعيرات الدموية أقل من ثانيتين يعكس استعادة التروية الدقيقة للأطراف.',
        },
        {
          en: 'ARDS: Non-cardiogenic pulmonary edema developing due to capillary leak.',
          ar: 'متلازمة الضائقة التنفسية الحادة: ارتشاح رئوي غير قلبي نتيجة تسرب الشعيرات الدموية بالرئة.',
        },
      ],
      verification: {
        requiresVerification: false,
      },
      examFocus: [
        {
          category: 'complications',
          categoryLabelAr: 'مضاعفات وأهداف التعافي',
          pointsEn: [
            'Resuscitation goals: MAP >= 65 mmHg, Urine >= 0.5 mL/kg/hr, Lactate < 2 mmol/L.',
            'ARDS and DIC are the most feared multi-system complications of refractory shock.',
          ],
          pointsAr: [
            'أهداف الإنعاش الناجح: ضغط شرياني >= 65، بول >= 0.5 مل/كجم/ساعة، ولاكتات أقل من 2.',
            'متلازمة الضائقة التنفسية (ARDS) والتخثر المنتشر (DIC) هما أخطر مضاعفات الصدمة المتأخرة.',
          ],
        },
      ],
      explanation: {
        simpleEnglish:
          'How do you know the patient is getting better? The monitor shows MAP >= 65, the urine bag fills up steadily, and blood tests show lactic acid dropping. If shock lasts too long, lungs fill with fluid (ARDS) and kidneys stop working.',
        arabic:
          'كيف نتأكد من شفاء المريض وخروجه من دائرة الخطر؟ عندما يستقر الضغط الشرياني فوق 65، ويطرح المريض بولاً كافياً، وينخفض حمض اللاكتيك في الدم، وتدفأ الأطراف ويصبح زمن الامتلاء الشعيري أقل من ثانيتين.',
        egyptianArabic:
          'إزاي تعرف كتمريض إن مجهودك جاب نتيجة والعيان فلت من الصدمة؟ لما تلاقي كيس البول بيجمع طبيعي، واللاكتات في التحليل بينزل تحت 2، وضغطه الشرياني MAP فوق 65، وصوابعه دفيت وزمن الامتلاء الشعيري (Capillary Refill) رجع أقل من ثانيتين. لو اتأخرنا، العيان بيدخل في فشل كلوي وارتشاح رئوي ARDS لا قدر الله.',
      },
      terms: [
        {
          id: 'term_012',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 6,
          english: 'Capillary Refill Time',
          arabic: 'زمن امتلاء الشعيرات الدموية',
          ipa: '/ˈkæp.əˌlɛr.i ˈriː.fɪl taɪm/',
          definitionEn: 'The time taken for color to return to an external capillary bed after pressure is applied to cause blanching (normal < 2 seconds).',
          definitionAr: 'الوقت المستغرق لعودة اللون الوردي للشعيرات الدموية تحت الظفر بعد الضغط عليه (الطبيعي أقل من ثانيتين).',
          relatedTerms: ['Peripheral Perfusion', 'Blanching', 'Vasoconstriction'],
          isBookmarked: true,
        },
        {
          id: 'term_013',
          lectureId: 'lecture_shock_001',
          sourceSlideNumber: 6,
          english: 'ARDS (Acute Respiratory Distress Syndrome)',
          arabic: 'متلازمة الضائقة التنفسية الحادة',
          ipa: '/ɑːrdz/',
          definitionEn: 'A life-threatening form of respiratory failure characterized by widespread inflammatory damage to the lungs and severe hypoxemia.',
          definitionAr: 'فشل تنفسي حاد مهدد للحياة ناتج عن التهاب وتلف واسع في الغشاء السنخي الشعيري بالرئتين ونقص أكسجة مستعصٍ.',
          relatedTerms: ['Mechanical Ventilation', 'PEEP', 'Refractory Hypoxemia'],
          isBookmarked: false,
        },
      ],
    },
  ],
  terms: [
    {
      id: 'term_001',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 1,
      english: 'Tissue Perfusion',
      arabic: 'التروية النسيجية',
      ipa: '/ˈtɪʃuː pərˈfjuːʒən/',
      definitionEn: 'The passage of fluid (such as blood) through the circulatory system to an organ or a tissue.',
      definitionAr: 'مرور وتدفق الدم المحمل بالأكسجين والمغذيات عبر الشعيرات الدموية لتغذية أنسجة الجسم.',
      relatedTerms: ['Microcirculation', 'Hypoxia', 'Ischemia'],
      isBookmarked: true,
    },
    {
      id: 'term_002',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 1,
      english: 'Cellular Hypoxia',
      arabic: 'نقص الأكسجة الخلوية',
      ipa: '/ˈsɛljʊlər haɪˈpɑːksiə/',
      definitionEn: 'A state in which cells are deprived of adequate oxygen supply at the microscopic level.',
      definitionAr: 'حالة حرمان خلايا الجسم من الإمداد الكافي من غاز الأكسجين الضروري لإنتاج الطاقة.',
      relatedTerms: ['Hypoxemia', 'Cyanosis', 'Anaerobic Metabolism'],
      isBookmarked: false,
    },
    {
      id: 'term_003',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 1,
      english: 'Anaerobic Metabolism',
      arabic: 'الأيض اللاهوائي',
      ipa: '/ˌæn.əˈroʊ.bɪk məˈtæb.ə.lɪ.zəm/',
      definitionEn: 'The creation of energy through the combustion of carbohydrates in the absence of oxygen, yielding lactic acid.',
      definitionAr: 'توليد الطاقة الخلوية في غياب الأكسجين، مما يؤدي لتراكم حمض اللاكتيك وحدوث حماض أيضي.',
      relatedTerms: ['Lactate', 'Metabolic Acidosis', 'ATP'],
      isBookmarked: false,
    },
    {
      id: 'term_004',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 2,
      english: 'Hypovolemic Shock',
      arabic: 'صدمة نقص حجم الدم',
      ipa: '/ˌhaɪ.poʊ.voʊˈliː.mɪk ʃɑːk/',
      definitionEn: 'Shock caused by critical loss of blood or fluid volume (>15-20% of total volume).',
      definitionAr: 'صدمة ناتجة عن فقدان حاد في حجم الدم أو سوائل الجسم يتجاوز 15-20% من الحجم الكلي.',
      relatedTerms: ['Hemorrhage', 'Dehydration', 'CVP'],
      isBookmarked: true,
    },
    {
      id: 'term_005',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 2,
      english: 'Cardiac Tamponade',
      arabic: 'الاندحاس القلبي / الارتشاح التاموري الضاغط',
      ipa: '/ˈkɑːr.di.æk ˌtæm.pəˈneɪd/',
      definitionEn: 'Compression of the heart caused by fluid accumulation in the pericardial sac.',
      definitionAr: 'انضغاط حاد لعضلة القلب بسبب تجمع السوائل أو الدم داخل كيس التامور المحيط به، مانعاً امتلاء البطينين.',
      relatedTerms: ['Beck Triad', 'Pulsus Paradoxus', 'Pericardiocentesis'],
      isBookmarked: false,
    },
    {
      id: 'term_006',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 3,
      english: 'Oliguria',
      arabic: 'شح البول / قلة إدرار البول',
      ipa: '/ˌɑː.lɪˈɡjʊr.i.ə/',
      definitionEn: 'Abnormally small production of urine (< 400 mL/day or < 0.5 mL/kg/hr in adults).',
      definitionAr: 'انخفاض غير طبيعي في حجم البول المطروح (أقل من 0.5 مل لكل كجم من وزن الجسم بالساعة).',
      relatedTerms: ['Anuria', 'Acute Kidney Injury', 'Creatinine'],
      isBookmarked: true,
    },
    {
      id: 'term_007',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 3,
      english: 'MODS (Multiple Organ Dysfunction Syndrome)',
      arabic: 'متلازمة الخلل الوظيفي المتعدد للأعضاء',
      ipa: '/mɒdz/',
      definitionEn: 'Altered organ function in an acutely ill patient requiring medical intervention to achieve homeostasis.',
      definitionAr: 'فشل حاد متزامن في وظائف عضوين أو أكثر في المريض الحرج يستدعي تدخلاً مكثفاً للبقاء حياً.',
      relatedTerms: ['SIRS', 'Sepsis', 'DIC'],
      isBookmarked: false,
    },
    {
      id: 'term_008',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 4,
      english: 'Fluid Resuscitation',
      arabic: 'الإنعاش بالسوائل الوريدية',
      ipa: '/ˈfluːɪd rɪˌsʌsɪˈteɪʃən/',
      definitionEn: 'The medical practice of replenishing bodily fluids lost through sweating, bleeding, or dehydration.',
      definitionAr: 'إعطاء كميات محسوبة وسريعة من السوائل المعقمة بالوريد لاستعادة حجم الدم الشرياني الفعال.',
      relatedTerms: ['Crystalloids', 'Colloids', 'Bolus'],
      isBookmarked: true,
    },
    {
      id: 'term_009',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 4,
      english: 'Modified Trendelenburg',
      arabic: 'وضعية ترندلنبورغ المعدلة',
      ipa: '/ˈmɒdɪfaɪd trɛnˈdɛlənbɜːrɡ/',
      definitionEn: 'Patient lies supine with lower extremities elevated 20 degrees while trunk remains horizontal.',
      definitionAr: 'استلقاء المريض على ظهره أفقياً مع رفع الساقين للأعلى بزاوية 20 درجة لتعزيز التروية الدماغية والقلبية.',
      relatedTerms: ['Venous Return', 'Preload', 'Postural Hypotension'],
      isBookmarked: false,
    },
    {
      id: 'term_010',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 5,
      english: 'Vasopressor',
      arabic: 'قابض للأوعية الدموية / رافع للضغط',
      ipa: '/ˌveɪzoʊˈprɛsər/',
      definitionEn: 'A medication that constricts blood vessels, increasing systemic vascular resistance and blood pressure.',
      definitionAr: 'دواء يسبب انقباضاً وتضيقاً في الأوعية الدموية مما يؤدي لرفع المقاومة الوعائية وضغط الدم.',
      relatedTerms: ['Norepinephrine', 'Extravasation', 'SVR'],
      isBookmarked: true,
    },
    {
      id: 'term_011',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 5,
      english: 'Inotropic Agent',
      arabic: 'معدل قوة الانقباض القلبي',
      ipa: '/ˌaɪnəˈtrɒpɪk ˈeɪdʒənt/',
      definitionEn: 'An agent that alters the force or energy of muscular contractions, particularly myocardial contractility.',
      definitionAr: 'عقار يؤثر مباشرة على قوة وكفاءة انقباض عضلة القلب (إيجابياً لزيادة قوة الضخ).',
      relatedTerms: ['Dobutamine', 'Ejection Fraction', 'Cardiac Output'],
      isBookmarked: false,
    },
    {
      id: 'term_012',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 6,
      english: 'Capillary Refill Time',
      arabic: 'زمن امتلاء الشعيرات الدموية',
      ipa: '/ˈkæp.əˌlɛr.i ˈriː.fɪl taɪm/',
      definitionEn: 'The time taken for color to return to an external capillary bed after pressure is applied to cause blanching (normal < 2 seconds).',
      definitionAr: 'الوقت المستغرق لعودة اللون الوردي للشعيرات الدموية تحت الظفر بعد الضغط عليه (الطبيعي أقل من ثانيتين).',
      relatedTerms: ['Peripheral Perfusion', 'Blanching', 'Vasoconstriction'],
      isBookmarked: true,
    },
  ],
  questions: [
    {
      id: 'q_mcq_001',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 3,
      type: 'mcq',
      difficulty: 'medium',
      questionEn: 'Which clinical finding is considered the earliest physiological indicator of shock in the compensatory stage?',
      questionAr: 'أي من العلامات السريرية التالية يُعتبر أبكر مؤشر فسيولوجي لحدوث الصدمة في المرحلة التعويضية؟',
      options: [
        { id: 'A', textEn: 'Severe hypotension (SBP < 80 mmHg)', textAr: 'هبوط حاد في ضغط الدم (أقل من 80)' },
        { id: 'B', textEn: 'Tachycardia (Heart rate > 100 bpm)', textAr: 'تسارع ضربات القلب (النبض > 100)' },
        { id: 'C', textEn: 'Complete anuria with coma', textAr: 'انقطاع تام للبول مع غيبوبة' },
        { id: 'D', textEn: 'Significant drop in body temperature', textAr: 'انخفاض شديد في حرارة الجسم' },
      ],
      correctAnswer: 'B',
      explanationEn: 'In the compensatory stage, blood pressure remains normal while tachycardia acts as the earliest compensatory response driven by sympathetic catecholamine release.',
      explanationAr: 'في المرحلة التعويضية يظل ضغط الدم طبيعياً، ويكون تسارع ضربات القلب (Tachycardia) هو العلامة المبكرة الأولى لتعويض النقص عبر إفراز الأدرينالين.',
      isValidated: true,
      validationSourceQuote: 'Compensatory Stage: Blood pressure is maintained within normal range through sympathetic stimulation (tachycardia).',
    },
    {
      id: 'q_mcq_002',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 4,
      type: 'mcq',
      difficulty: 'hard',
      questionEn: 'What is the recommended size of peripheral IV catheters for rapid fluid resuscitation in a patient in hypovolemic shock?',
      questionAr: 'ما هو المقاس الموصى به للقساطر الوريدية الطرفية للإنعاش السريع بالسوائل في مريض يعاني من صدمة نقص حجم الدم؟',
      options: [
        { id: 'A', textEn: '22-gauge or 24-gauge (Blue / Yellow)', textAr: 'مقاس 22 أو 24 (أزرق / أصفر)' },
        { id: 'B', textEn: '20-gauge (Pink)', textAr: 'مقاس 20 (وردي)' },
        { id: 'C', textEn: '14-gauge or 16-gauge (Orange / Grey)', textAr: 'مقاس 14 أو 16 (برتقالي / رمادي واسع القطر)' },
        { id: 'D', textEn: 'Subcutaneous butterfly needle', textAr: 'إبرة فراشة تحت الجلد' },
      ],
      correctAnswer: 'C',
      explanationEn: 'Large-bore peripheral IV lines (14G or 16G) have the widest lumen, allowing rapid high-volume crystalloid infusion to restore intravascular pressure.',
      explanationAr: 'القساطر الوريدية كبيرة القطر (14G أو 16G) ذات قطر داخلي واسع يسمح بالتدفق السريع لكميات كبيرة من المحاليل لرفع الضغط.',
      isValidated: true,
      validationSourceQuote: 'Rapid fluid resuscitation via two large-bore peripheral IV lines (14G or 16G) using isotonic crystalloids.',
    },
    {
      id: 'q_mcq_003',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 5,
      type: 'mcq',
      difficulty: 'hard',
      questionEn: 'Which vasopressor is recommended as the first-line medication in the management of Septic Shock?',
      questionAr: 'أي من الأدوية القابضة للأوعية يُوصى به كدواء الخط الأول في علاج الصدمة الإنتانية (تسمم الدم)؟',
      options: [
        { id: 'A', textEn: 'Norepinephrine (Levophed)', textAr: 'نورإبينفرين (نورأدرينالين)' },
        { id: 'B', textEn: 'Dobutamine', textAr: 'دوبيوتامين' },
        { id: 'C', textEn: 'Furosemide (Lasix)', textAr: 'فوروسيميد (لازكس)' },
        { id: 'D', textEn: 'Atropine Sulfate', textAr: 'كبريتات الأتروبين' },
      ],
      correctAnswer: 'A',
      explanationEn: 'Norepinephrine is the first-line vasopressor because it potent alpha-1 agonist activity restores vascular tone and increases Mean Arterial Pressure (MAP) to >= 65 mmHg.',
      explanationAr: 'النورإبينفرين هو رافع الضغط الأول المعتمد لأنه يسبب انقباضاً قوياً في الأوعية المتوسعة بالإنتان مما يعيد رفع متوسط الضغط الشرياني فوق 65.',
      isValidated: true,
      validationSourceQuote: 'Norepinephrine (Levophed): First-line vasopressor for septic and distributive shock to restore vascular tone.',
    },
    {
      id: 'q_tf_001',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 4,
      type: 'true_false',
      difficulty: 'medium',
      questionEn: 'Full Trendelenburg position is currently recommended for all patients in shock because it has no negative effect on breathing.',
      questionAr: 'يُوصى حالياً بوضعية ترندلنبورغ الكاملة لجميع مرضى الصدمة لعدم وجود أي تأثير سلبي لها على التنفس.',
      correctAnswer: 'False',
      explanationEn: 'False. Full Trendelenburg causes abdominal organs to press against the diaphragm, impairing respiratory function. The Modified Trendelenburg position (legs elevated 20 degrees with trunk flat) is recommended instead.',
      explanationAr: 'خطأ. وضعية ترندلنبورغ الكاملة تضغط أحشاء البطن على الحجاب الحاجز مما يعيق التنفس؛ والوضعية الصحيحة هي ترندلنبورغ المعدلة (رفع الساقين فقط 20 درجة مع بقاء الصدر مستوياً).',
      isValidated: true,
      validationSourceQuote: 'Modified Trendelenburg positioning (elevate lower extremities 20 degrees; avoid full Trendelenburg).',
    },
    {
      id: 'q_tf_002',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 5,
      type: 'true_false',
      difficulty: 'easy',
      questionEn: 'Intramuscular Epinephrine is the primary drug of choice in the immediate treatment of anaphylactic shock.',
      questionAr: 'يُعتبر الإبينفرين (الأدرينالين) بالحقن العضلي دواء الاختيار الأول والأساسي في العلاج الفوري لصدمة الحساسية المفرطة.',
      correctAnswer: 'True',
      explanationEn: 'True. Epinephrine IM is the first-line life-saving medication for anaphylaxis, counteracting bronchospasm and severe vasodilation.',
      explanationAr: 'صحيح. الإبينفرين العضلي هو العقار المنقذ الأول للحياة في الصدمة التحسسية لأنه يفتح الشعب الهوائية ويقبض الأوعية الدموية فوراً.',
      isValidated: true,
      validationSourceQuote: 'Epinephrine: First-line for anaphylactic shock (IM injection 0.3-0.5 mg 1:1000).',
    },
    {
      id: 'q_essay_001',
      lectureId: 'lecture_shock_001',
      sourceSlideNumber: 4,
      type: 'essay',
      difficulty: 'hard',
      questionEn: 'Outline the immediate priority nursing interventions for a patient admitted to the ICU in Hypovolemic Shock.',
      questionAr: 'اذكر التدخلات التمريضية ذات الأولوية العاجلة لمريض تم تنويمه بالعناية المركزة يعاني من صدمة نقص حجم الدم.',
      correctAnswer: 'Model Answer',
      modelAnswerEn:
        '1. Airway & Breathing: Deliver high-flow oxygen via non-rebreather mask targeting SpO2 > 94%.\n2. Circulation: Establish two large-bore peripheral IV lines (14G or 16G) immediately.\n3. Fluid Resuscitation: Rapidly infuse warm isotonic crystalloids (Normal Saline 0.9% or Ringer Lactate).\n4. Patient Positioning: Place in Modified Trendelenburg position (legs elevated 20 degrees, trunk flat).\n5. Monitoring: Insert an indwelling Foley catheter to monitor hourly urine output (goal >= 0.5 mL/kg/hr) and continuously track vital signs and MAP.',
      modelAnswerAr:
        '1. تأمين مجرى الهواء والتنفس: إعطاء أكسجين عالي التدفق عبر قناع غير عاكس للوصول إلى تشبع SpO2 > 94%.\n2. الدورة الدموية: تركيب كانيولتين وريديتين كبيرتين مقاس 14G أو 16G فوراً.\n3. الإنعاش بالسوائل: ضخ محاليل بلورية متساوية التوتر دافئة (محلول ملح أو رينجر لاكتات).\n4. وضعية المريض: وضع ترندلنبورغ المعدل (رفع الساقين 20 درجة مع بقاء الظهر أفقياً).\n5. المراقبة الدقيقة: تركيب قسطرة بول فولي لمتابعة إدرار البول بالساعة (المستهدف >= 0.5 مل/كجم/ساعة) ومراقبة العلامات الحيوية ومتوسط الضغط باستمرار.',
      explanationEn: 'Note: AI-generated exam prediction — not a guaranteed university exam question. Grading rubric: 2 points for airway/oxygen, 2 points for IV access, 2 points for fluids, 2 points for positioning, 2 points for hourly urine monitoring.',
      explanationAr: 'تنبيه: هذا السؤال المقالي توقع دراسي مولّد بالذكاء الاصطناعي لمساعدتك على المذاكرة وليس سؤال امتحان جامعي مضمون.',
      isValidated: true,
      validationSourceQuote: 'Immediate nursing interventions focus on optimizing oxygen delivery and restoring intravascular volume...',
    },
  ],
  summary: {
    quickReview: {
      titleEn: 'Quick 5-Minute Shock Revision',
      titleAr: 'مراجعة سريعة للصدمة في 5 دقائق',
      points: [
        {
          en: 'Shock is fundamentally inadequate tissue perfusion causing cellular hypoxia and lactic acidosis.',
          ar: 'الصدمة هي قصور التروية الدموية للأنسجة مما يسبب نقص الأكسجة وتراكم حمض اللاكتيك.',
        },
        {
          en: 'Four major categories: Hypovolemic, Cardiogenic, Obstructive, and Distributive.',
          ar: 'أربعة أنواع رئيسية: نقص السوائل، قلبية، انسدادية، وتوزيعية.',
        },
        {
          en: 'In Compensatory stage, BP is still normal! Tachycardia is the earliest sign.',
          ar: 'في المرحلة التعويضية يكون الضغط طبيعياً! تسارع النبض هو المؤشر المبكر الأول.',
        },
        {
          en: 'Use two 14G or 16G large-bore IV cannulas for rapid fluid resuscitation.',
          ar: 'استخدم كانيولتين كبيرتي القطر (14 أو 16) للإنعاش السريع بالمحاليل المتساوية التوتر.',
        },
        {
          en: 'Norepinephrine is the first-line vasopressor for septic shock; Epinephrine IM for anaphylaxis.',
          ar: 'نورإبينفرين هو رافع الضغط الأول للإنتان؛ وإبينفرين بالعضل لحساسية الصدمة المفرطة.',
        },
        {
          en: 'Hourly urine output (>= 0.5 mL/kg/hr) is the most reliable clinical indicator of vital organ perfusion.',
          ar: 'حساب إدرار البول بالساعة (>= 0.5 مل/كجم/ساعة) هو أدق مؤشر على سلامة التروية الكلوية.',
        },
      ],
    },
    standardSummary: {
      sections: [
        {
          headingEn: '1. Pathophysiology of Shock',
          headingAr: '1. فسيولوجيا مرض الصدمة',
          contentEn:
            'When tissue perfusion decreases below cellular requirements, cells undergo anaerobic metabolism. This yields minimal ATP and produces excess lactic acid, resulting in systemic acidosis, endothelial injury, and organ dysfunction.',
          contentAr:
            'عند هبوط التروية النسيجية دون حاجة الخلايا، تتحول الخلايا للأيض اللاهوائي مما ينتج طاقة شحيحة وتراكماً لحمض اللاكتيك، مسبباً حموضة عامة وتلفاً للشعيرات الدموية وفشل الأعضاء.',
        },
        {
          headingEn: '2. Clinical Stages & Early Recognition',
          headingAr: '2. المراحل السريرية والاكتشاف المبكر',
          contentEn:
            'Compensatory shock maintains arterial pressure through vasoconstriction and tachycardia. Progressive shock features falling BP, altered mental status, and oliguria. Irreversible shock leads to profound refractory multi-organ failure.',
          contentAr:
            'تحافظ المرحلة التعويضية على الضغط عبر النبض السريع وانقباض الشرايين. وتتميز المرحلة المتقدمة بهبوط الضغط وتدهور الوعي وشح البول. أما المرحلة المستعصية فتنتهي بفشل متعدد للأعضاء.',
        },
        {
          headingEn: '3. Priority Nursing Interventions',
          headingAr: '3. الأولويات والتدخلات التمريضية',
          contentEn:
            'The nurse establishes high-flow oxygen, two large-bore IV accesses (14G/16G), infuses warm crystalloids, places the patient in Modified Trendelenburg, and monitors hourly urine output via a Foley catheter.',
          contentAr:
            'يضع ممرض العناية الأكسجين فوراً، ويركب كانيولتين واسعتين (14G/16G)، ويضخ محاليل دافئة، ويضع المريض في وضع ترندلنبورغ المعدل، ويقيس كمية البول بالساعة بالمسطرة.',
        },
      ],
    },
    detailedReview: {
      clinicalKeyPoints: [
        {
          en: 'Mean Arterial Pressure (MAP) formula: (SBP + 2*DBP) / 3. Minimum target is >= 65 mmHg.',
          ar: 'معادلة متوسط الضغط الشرياني MAP = (الضغط الانقباضي + ضعف الانبساطي) ÷ 3. الهدف هو 65 فأكثر.',
        },
        {
          en: 'Serum lactate clearance (> 20% reduction every 2 hours) correlates with patient survival.',
          ar: 'معدل التخلص من حمض اللاكتيك بالدم (انخفاض أكثر من 20% كل ساعتين) يرتبط بنجاة المريض.',
        },
      ],
      nursingPearls: [
        {
          en: 'Never rely on a single normal blood pressure reading to rule out shock if the patient is tachycardic and pale.',
          ar: 'إياك الاعتماد على قراءة ضغط دم طبيعية واحدة لنفي الصدمة إذا كان المريض شاحباً ونبضه متسارعاً.',
        },
        {
          en: 'Always run vasopressors through a dedicated central line lumen with an electronic infusion pump.',
          ar: 'احرص دائماً على إعطاء رافعات الضغط عبر مسار مخصص في قسطرة وريد مركزي وباستخدام سرنجة كهربائية دقيقة.',
        },
      ],
      emergencyAlerts: [
        {
          en: 'Urine output dropping below 30 mL/hr is an immediate emergency indicator of renal shutdown.',
          ar: 'انخفاض إدرار البول إلى أقل من 30 مل بالساعة هو إنذار طارئ بفشل التروية الكلوية الوشيك.',
        },
        {
          en: 'Extravasation of Norepinephrine causes severe ischemic tissue necrosis. Phentolamine is the antidote.',
          ar: 'تسرب النورأدرينالين خارج الوريد يسبب تنخر الأنسجة، وترياقه الموضعي هو دواء فينتولامين.',
        },
      ],
    },
  },
  youtubeResources: [
    {
      id: 'yt_001',
      title: 'Shock Pathophysiology & Nursing Care - NCLEX Review',
      channelTitle: 'RegisteredNurseRN',
      thumbnailUrl: 'https://img.youtube.com/vi/qQ8uYf8F2L8/mqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=qQ8uYf8F2L8',
      duration: '18:45',
      relevanceTopic: 'Nursing Interventions & Types of Shock',
    },
    {
      id: 'yt_002',
      title: 'Types of Shock - Osmosis Medical Education',
      channelTitle: 'Osmosis from Elsevier',
      thumbnailUrl: 'https://img.youtube.com/vi/aL3N5m_w1E4/mqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=aL3N5m_w1E4',
      duration: '12:30',
      relevanceTopic: 'Cardiogenic, Hypovolemic & Septic Shock',
    },
    {
      id: 'yt_003',
      title: 'Shock: Hemodynamics & Vasopressors',
      channelTitle: 'Ninja Nerd',
      thumbnailUrl: 'https://img.youtube.com/vi/V8M1qQ6yqY0/mqdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=V8M1qQ6yqY0',
      duration: '42:15',
      relevanceTopic: 'Norepinephrine, Dobutamine & MAP Targets',
    },
  ],
};
