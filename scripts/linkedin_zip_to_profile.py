#!/usr/bin/env python3
import sys, os, json, csv, re, zipfile
from datetime import datetime

# Flexible field access

def get_field(row, candidates):
    low = { (k or '').strip().lower(): (v or '').strip() for k,v in row.items() }
    for c in candidates:
        k = c.strip().lower()
        if k in low:
            return low[k]
    # fuzzy contains match
    for c in candidates:
        needle = c.strip().lower()
        for k in low.keys():
            if needle in k:
                return low[k]
    return ''

MONTHS = {
    'jan':1,'feb':2,'mar':3,'apr':4,'may':5,'jun':6,
    'jul':7,'aug':8,'sep':9,'sept':9,'oct':10,'nov':11,'dec':12
}

def pad2(n):
    return f"{int(n):02d}"

def norm_date(val):
    if not val:
        return None
    t = str(val).strip()
    if not t or re.search(r'present', t, re.I):
        return None
    # YYYY or YYYY-MM
    if re.match(r'^\d{4}(-\d{1,2})?$', t):
        return re.sub(r'-(\d)$', r'-0\1', t)
    # MMM YYYY
    m = re.match(r'^([A-Za-z]{3,9})\s+(\d{4})$', t)
    if m:
        mm = MONTHS.get(m.group(1).lower()[:3])
        return f"{m.group(2)}-{pad2(mm)}" if mm else m.group(2)
    # M/D/YYYY or M/YYYY
    m = re.match(r'^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$', t)
    if m:
        yy = m.group(3)
        yy = f"20{yy}" if len(yy) == 2 else yy
        return f"{yy}-{pad2(m.group(1))}"
    m = re.match(r'^(\d{1,2})[/-](\d{4})$', t)
    if m:
        return f"{m.group(2)}-{pad2(m.group(1))}"
    # fallback: year
    m = re.search(r'(\d{4})', t)
    return m.group(1) if m else None


def read_csv_from_zip(z, name_pattern):
    # name_pattern: compiled regex
    for n in z.namelist():
        if name_pattern.match(os.path.basename(n)):
            with z.open(n) as f:
                text = f.read().decode('utf-8', errors='ignore')
                rows = list(csv.DictReader(text.splitlines()))
                return rows
    return None


def map_positions(rows):
    out = []
    for r in rows or []:
        company = get_field(r, ['Company Name','Company'])
        title = get_field(r, ['Title','Position','Role'])
        location = get_field(r, ['Location'])
        desc = get_field(r, ['Description','Summary'])
        start = norm_date(get_field(r, ['Started On','Start Date','From','From Date']))
        end = norm_date(get_field(r, ['Finished On','End Date','To','To Date']))
        current = get_field(r, ['Current Position','Currently Working Here']).lower()
        if not end and current in ('true','yes','1'):
            end = None
        out.append({
            'company': company,
            'title': title,
            'startDate': start,
            'endDate': end,
            'location': location,
            'description': desc
        })
    return [x for x in out if x.get('company') or x.get('title')]


def map_education(rows):
    out = []
    for r in rows or []:
        school = get_field(r, ['School Name','University','Institution'])
        degree = get_field(r, ['Degree Name','Degree'])
        field = get_field(r, ['Field of Study','Field'])
        start = norm_date(get_field(r, ['Start Date','From','From Date','Started On']))
        end = norm_date(get_field(r, ['End Date','To','To Date','Finished On']))
        summary = get_field(r, ['Description'])
        out.append({
            'school': school,
            'degree': ' • '.join([v for v in [degree, field] if v]),
            'startDate': start,
            'endDate': end,
            'description': summary
        })
    return [x for x in out if x.get('school')]


def map_skills(rows):
    out = []
    for r in rows or []:
        name = get_field(r, ['Name','Skill','Skill Name']) or (r if isinstance(r, str) else '')
        if name:
            out.append({'name': name, 'level': 75})
    return out


def map_certifications(rows):
    out = []
    for r in rows or []:
        name = get_field(r, ['Name','Certification Name'])
        issuer = get_field(r, ['Issuing Organization','Issuer','Authority'])
        issueDate = norm_date(get_field(r, ['Issue Date','Issued On']))
        expirationDate = norm_date(get_field(r, ['Expiration Date','Expires On']))
        credentialId = get_field(r, ['Credential ID','License Number'])
        credentialUrl = get_field(r, ['Credential URL','URL'])
        if name:
            out.append({
                'name': name,
                'issuer': issuer,
                'issueDate': issueDate,
                'expirationDate': expirationDate,
                'credentialId': credentialId,
                'credentialUrl': credentialUrl
            })
    return out


def map_languages(rows):
    out = []
    for r in rows or []:
        name = get_field(r, ['Name','Language'])
        proficiency = get_field(r, ['Proficiency','Level'])
        if name:
            out.append({'name': name, 'proficiency': proficiency})
    return out


def map_honors(rows):
    out = []
    for r in rows or []:
        title = get_field(r, ['Title','Honor','Award'])
        issuer = get_field(r, ['Issuer','Issued By','Associated With'])
        date = norm_date(get_field(r, ['Date','Issue Date','Received On']))
        description = get_field(r, ['Description','Notes'])
        if title:
            out.append({'title': title, 'issuer': issuer, 'date': date, 'description': description})
    return out


def main():
    if len(sys.argv) < 2:
        print('Usage: python3 scripts/linkedin_zip_to_profile.py /absolute/path/to/Basic_LinkedInDataExport.zip')
        sys.exit(1)
    zip_path = sys.argv[1]
    repo_root = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(repo_root)
    profile_path = os.path.join(repo_root, 'data', 'profile.json')

    positions = education = skills = certifications = languages = honors = None
    profile_rows = summary_rows = emails_rows = phones_rows = None

    if os.path.isdir(zip_path):
        # Read directly from directory
        def read_csv_from_dir(dir_path, base_name):
            for name in os.listdir(dir_path):
                if re.match(fr'^{re.escape(base_name)}\.csv$', name, re.I):
                    p = os.path.join(dir_path, name)
                    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                        return list(csv.DictReader(f))
            return None
        positions = read_csv_from_dir(zip_path, 'Positions') or []
        education = read_csv_from_dir(zip_path, 'Education') or []
        skills = read_csv_from_dir(zip_path, 'Skills') or []
        certifications = read_csv_from_dir(zip_path, 'Certifications') or []
        languages = read_csv_from_dir(zip_path, 'Languages') or []
        honors = read_csv_from_dir(zip_path, 'Honors') or []
        profile_rows = read_csv_from_dir(zip_path, 'Profile') or []
        summary_rows = read_csv_from_dir(zip_path, 'Profile Summary') or []
        emails_rows = read_csv_from_dir(zip_path, 'Email Addresses') or []
        phones_rows = read_csv_from_dir(zip_path, 'PhoneNumbers') or []
    elif os.path.isfile(zip_path):
        with zipfile.ZipFile(zip_path, 'r') as z:
            positions = read_csv_from_zip(z, re.compile(r'^Positions\.csv$', re.I)) or []
            education = read_csv_from_zip(z, re.compile(r'^Education\.csv$', re.I)) or []
            skills = read_csv_from_zip(z, re.compile(r'^Skills\.csv$', re.I)) or []
            certifications = read_csv_from_zip(z, re.compile(r'^Certifications\.csv$', re.I)) or []
            languages = read_csv_from_zip(z, re.compile(r'^Languages\.csv$', re.I)) or []
            honors = read_csv_from_zip(z, re.compile(r'^Honors\.csv$', re.I)) or []
            profile_rows = read_csv_from_zip(z, re.compile(r'^Profile\.csv$', re.I)) or []
            summary_rows = read_csv_from_zip(z, re.compile(r'^Profile Summary\.csv$', re.I)) or []
            emails_rows = read_csv_from_zip(z, re.compile(r'^Email Addresses\.csv$', re.I)) or []
            phones_rows = read_csv_from_zip(z, re.compile(r'^PhoneNumbers\.csv$', re.I)) or []
    else:
        print(f'ZIP or directory not found: {zip_path}')
        sys.exit(2)

    # Load existing profile.json
    if os.path.isfile(profile_path):
        with open(profile_path, 'r', encoding='utf-8') as f:
            profile = json.load(f)
    else:
        profile = {}

    # Merge content
    profile['experience'] = map_positions(positions)
    profile['education'] = map_education(education)
    if skills:
        profile['skills'] = map_skills(skills)

    profile['certifications'] = map_certifications(certifications)
    profile['languages'] = map_languages(languages)
    profile['honors'] = map_honors(honors)

    # Summary/contact enrichment
    if summary_rows:
        s = get_field(summary_rows[0], ['Summary','Profile Summary'])
        if s:
            profile['summary'] = s
    contact = profile.get('contact', {})
    if profile_rows:
        p = profile_rows[0]
        first = get_field(p, ['First Name'])
        last = get_field(p, ['Last Name'])
        headline = get_field(p, ['Headline'])
        city = get_field(p, ['City','Location'])
        country = get_field(p, ['Country'])
        loc = ', '.join([v for v in [city, country] if v])
        if first or last:
            contact['name'] = ' '.join([v for v in [first, last] if v])
        if headline:
            contact['title'] = headline
        if loc:
            contact['location'] = loc
    if emails_rows:
        contact['email'] = get_field(emails_rows[0], ['Email Address','Email']) or contact.get('email')
    if phones_rows:
        contact['phone'] = get_field(phones_rows[0], ['Number','Phone Number']) or contact.get('phone')
    if contact:
        profile['contact'] = contact

    # Write back
    os.makedirs(os.path.dirname(profile_path), exist_ok=True)
    with open(profile_path, 'w', encoding='utf-8') as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)

    # Report
    print('Wrote data/profile.json')
    print('Counts:', {
        'experience': len(profile.get('experience', [])),
        'education': len(profile.get('education', [])),
        'skills': len(profile.get('skills', [])),
        'certifications': len(profile.get('certifications', [])),
        'languages': len(profile.get('languages', [])),
        'honors': len(profile.get('honors', [])),
    })

if __name__ == '__main__':
    main()
