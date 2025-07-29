# Repository Transfer Checklist for Scottish Government Device

## ✅ Pre-Transfer Status (Completed)

- [x] Site URL updated to `https://scotgovuk.github.io/ScotAccount-TechDocs`
- [x] All changes committed and pushed to AIApplied repository
- [x] Build tested locally and working correctly
- [x] GitHub Actions workflow configured for deployment

## 🔄 Transfer Steps (To be done on Scottish Government device)

### Step 1: Access Current Repository

- **URL**: `https://github.com/AIAppliedUK/ScotAccount-TechDocs`
- **Account**: Use Scottish Government GitHub credentials

### Step 2: Transfer Repository

1. Go to repository **Settings** → **General**
2. Scroll down to **Transfer ownership** section
3. Click **Transfer ownership**
4. Enter new owner: `scotgovuk` (or appropriate Scottish Government account)
5. Confirm transfer

### Step 3: Configure GitHub Pages

1. Go to transferred repository: `https://github.com/scotgovuk/ScotAccount-TechDocs`
2. Navigate to **Settings** → **Pages**
3. Configure:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

### Step 4: Verify Deployment

1. Check **Actions** tab for successful deployment
2. Wait 2-5 minutes for first deployment
3. Access site: `https://scotgovuk.github.io/ScotAccount-TechDocs`

## 📋 Post-Transfer Tasks

### Repository Settings

- [ ] Update repository description
- [ ] Add topics: `scotaccount`, `scottish-government`, `documentation`
- [ ] Set website URL to GitHub Pages URL

### Team Access

- [ ] Add appropriate team members
- [ ] Set appropriate permissions for documentation maintainers

### Security

- [ ] Set up branch protection rules for `main`
- [ ] Configure required pull request reviews
- [ ] Enable security scanning features

## 🔧 Troubleshooting

### If Build Fails

- Check Actions tab for error logs
- Ensure Node.js 16+ compatibility
- Verify all dependencies are installed

### If Site Shows 404

- Ensure `gh-pages` branch is created
- Check Pages source is set to `gh-pages` branch
- Verify repository name matches URL path

### If Styling Issues

- Check CSS files are being copied correctly
- Verify asset paths are relative to repository root

## 📞 Support Contacts

- **GitHub Support**: For repository transfer issues
- **Scottish Government IT**: For organizational access
- **Documentation Team**: For content and deployment questions

---

**Repository Details**:

- **Current**: `https://github.com/AIAppliedUK/ScotAccount-TechDocs`
- **Target**: `https://github.com/scotgovuk/ScotAccount-TechDocs`
- **Site URL**: `https://scotgovuk.github.io/ScotAccount-TechDocs`
