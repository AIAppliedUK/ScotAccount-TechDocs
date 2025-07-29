# Repository Transfer Guide for Scottish Government GitHub Account

## Overview

This guide provides step-by-step instructions for transferring the ScotAccount Technical Documentation repository to the Scottish Government GitHub account and ensuring proper GitHub Pages deployment.

## Pre-Transfer Checklist

### ✅ Completed Updates

1. **Site URL Configuration**: Updated `src/_data/site.json` to use the correct GitHub Pages URL format:

   - **Old**: `https://scotaccount-tech-docs.gov.scot`
   - **New**: `https://scotgovuk.github.io/ScotAccount-TechDocs`

2. **GitHub Actions Workflow**: The `.github/workflows/deploy.yml` is already configured for GitHub Pages deployment

3. **Build Configuration**: Eleventy configuration in `.eleventy.js` is properly set up

## Transfer Workflow

### Current Status

- ✅ **Repository**: `https://github.com/AIAppliedUK/ScotAccount-TechDocs`
- ✅ **Changes Pushed**: Site URL updated for Scottish Government GitHub account
- ✅ **Build Tested**: Local build working correctly
- ✅ **GitHub Actions**: Configured for automatic deployment

### Transfer Steps

1. **Ensure all changes are committed and pushed to AIApplied repository**:

   ```bash
   git add .
   git commit -m "Update site URL for Scottish Government GitHub account"
   git push origin main
   ```

   ✅ **Completed**: Changes have been pushed to `https://github.com/AIAppliedUK/ScotAccount-TechDocs`

2. **Create a backup branch** (optional):
   ```bash
   git checkout -b backup-before-transfer
   git push origin backup-before-transfer
   ```

### Step 2: Transfer Repository

1. **Go to the current repository**: `https://github.com/AIAppliedUK/ScotAccount-TechDocs`

2. **Navigate to Settings** → **General** → **Transfer ownership**

3. **Enter the new owner**: `scotgovuk` (or the appropriate Scottish Government GitHub account)

4. **Confirm the transfer**

### Step 3: Configure GitHub Pages

After the transfer, configure GitHub Pages on the new account:

1. **Go to the transferred repository**: `https://github.com/scotgovuk/ScotAccount-TechDocs`

2. **Navigate to Settings** → **Pages**

3. **Configure the source**:

   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`

4. **Save the configuration**

### Step 4: Verify Deployment

1. **Check the Actions tab** to ensure the deployment workflow runs successfully

2. **Wait for the first deployment** (usually takes 2-5 minutes)

3. **Access the site** at: `https://scotgovuk.github.io/ScotAccount-TechDocs`

## Post-Transfer Configuration

### Update Repository Settings

1. **Description**: Update to reflect Scottish Government ownership
2. **Topics**: Add relevant tags like `scotaccount`, `scottish-government`, `documentation`
3. **Website**: Set to the GitHub Pages URL

### Team Access

1. **Add appropriate team members** from the Scottish Government GitHub organization
2. **Set appropriate permissions** for documentation maintainers

### Custom Domain (Optional)

If you want to use a custom domain later:

1. **Purchase/configure domain**: `scotaccount-tech-docs.gov.scot`
2. **Add CNAME record** pointing to `scotgovuk.github.io`
3. **Configure in GitHub Pages settings**

## Troubleshooting

### Common Issues

1. **Build Failures**:

   - Check the Actions tab for error logs
   - Ensure Node.js version compatibility (requires 16+)
   - Verify all dependencies are properly installed

2. **404 Errors**:

   - Ensure the `gh-pages` branch is created
   - Check that the Pages source is set to `gh-pages` branch
   - Verify the repository name matches the URL path

3. **Styling Issues**:
   - Check that CSS files are being copied correctly
   - Verify asset paths are relative to the repository root

### Verification Commands

```bash
# Test build locally
npm run build

# Check generated files
ls -la _site/

# Verify CSS and assets are present
ls -la _site/css/
ls -la _site/assets/
```

## Security Considerations

1. **Repository Visibility**: Ensure appropriate visibility settings for Scottish Government
2. **Branch Protection**: Set up branch protection rules for `main`
3. **Required Reviews**: Configure required pull request reviews
4. **Security Scanning**: Enable GitHub's security features

## Documentation Updates

After successful transfer, consider updating:

1. **README.md**: Update any references to the old repository URL
2. **Contributing Guidelines**: Add Scottish Government-specific contribution guidelines
3. **Contact Information**: Update contact details for Scottish Government team

## Support

For technical issues during transfer:

1. **GitHub Support**: For repository transfer issues
2. **Scottish Government IT**: For organizational access and permissions
3. **Documentation Team**: For content and deployment questions

---

**Note**: This guide assumes the Scottish Government GitHub account is `scotgovuk`. Adjust the account name as needed for your specific organization.
